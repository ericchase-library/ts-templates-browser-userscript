import { IntoPattern } from '../../../src/lib/ericchase/Platform/FilePath.js';
import { Logger } from '../../../src/lib/ericchase/Utility/Logger.js';
import { BuilderInternal, ProcessorModule, ProjectFile } from '../../lib/Builder.js';
import { pattern, ProcessBunBuildResults } from '../../lib/processors/TypeScript-GenericBundler.js';

const logger = Logger(Processor_TypeScript_UserscriptBundler.name);

type Options = Parameters<typeof Bun.build>[0];
interface Config {
  define?: Options['define'] | (() => Options['define']);
  env?: Options['env'];
  sourcemap?: Options['sourcemap'];
}

// External pattern cannot contain more than one "*" wildcard.
export function Processor_TypeScript_UserscriptBundler(config: Config): ProcessorModule {
  return new CProcessor_TypeScript_UserscriptBundler(config);
}

class CProcessor_TypeScript_UserscriptBundler implements ProcessorModule {
  channel = logger.newChannel();

  bundlefile_set = new Set<ProjectFile>();

  constructor(readonly config: Config) {
    this.config.env ??= 'disable';
    this.config.sourcemap ??= 'none';
  }
  async onAdd(builder: BuilderInternal, files: Set<ProjectFile>): Promise<void> {
    let trigger_reprocess = false;
    for (const file of files) {
      const file_pattern = IntoPattern(file.src_path);
      if (builder.platform.Utility.globMatch(file_pattern, `**/*{.user}${pattern.tstsxjsjsx}`)) {
        file.out_path.ext = '.js';
        file.addProcessor(this, this.onProcessUserScript);
        this.bundlefile_set.add(file);
        continue;
      }
      if (builder.platform.Utility.globMatch(file_pattern, `**/*${pattern.tstsxjsjsx}`)) {
        trigger_reprocess = true;
      }
    }
    if (trigger_reprocess === true) {
      for (const file of this.bundlefile_set) {
        builder.reprocessFile(file);
      }
    }
  }
  async onRemove(builder: BuilderInternal, files: Set<ProjectFile>): Promise<void> {
    let trigger_reprocess = false;
    for (const file of files) {
      const file_pattern = IntoPattern(file.src_path);
      if (builder.platform.Utility.globMatch(file_pattern, `**/*{.user}${pattern.tstsxjsjsx}`)) {
        this.bundlefile_set.delete(file);
        continue;
      }
      if (builder.platform.Utility.globMatch(file_pattern, `**/*${pattern.tstsxjsjsx}`)) {
        trigger_reprocess = true;
      }
    }
    if (trigger_reprocess === true) {
      for (const file of this.bundlefile_set) {
        builder.reprocessFile(file);
      }
    }
  }

  async onProcessUserScript(builder: BuilderInternal, file: ProjectFile): Promise<void> {
    await ProcessBunBuildResults(
      builder,
      file,
      Bun.build({
        define: typeof this.config.define === 'function' ? this.config.define() : this.config.define,
        entrypoints: [file.src_path.raw],
        env: this.config.env,
        format: 'esm',
        minify: {
          identifiers: false,
          syntax: false,
          whitespace: false,
        },
        sourcemap: this.config.sourcemap,
        target: 'browser',
        banner: await getUserscriptHeader(file),
      }),
      this.channel,
    );
  }
}

async function getUserscriptHeader(file: ProjectFile) {
  const text = await file.getText();
  const start = text.match(/^\/\/.*?==UserScript==.*?$/dim);
  const end = text.match(/^\/\/.*?==\/UserScript==.*?$/dim);
  const header = text.slice(start?.indices?.[0][0] ?? 0, end?.indices?.[0][1] ?? 0);
  return `${header}\n`;
}
