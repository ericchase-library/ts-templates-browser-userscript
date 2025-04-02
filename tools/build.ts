import { Processor_UserscriptBundler } from './lib-browser-userscript/processors/TypeScript-UserscriptBundler.js';
import { Builder } from './lib/Builder.js';
import { Processor_BasicWriter } from './lib/processors/FS-BasicWriter.js';
import { Processor_HTML_CustomComponent } from './lib/processors/HTML-CustomComponent.js';
import { Processor_HTML_ImportConverter } from './lib/processors/HTML-ImportConverter.js';
import { Processor_TypeScript_GenericBundlerImportRemapper } from './lib/processors/TypeScript-GenericBundler-ImportRemapper.js';
import { pattern, Processor_TypeScript_GenericBundler } from './lib/processors/TypeScript-GenericBundler.js';
import { Step_Bun_Run } from './lib/steps/Bun-Run.js';
import { DEVSERVERHOST, Step_DevServer } from './lib/steps/Dev-Server.js';
import { Step_CleanDirectory } from './lib/steps/FS-CleanDirectory.js';
import { Step_Format } from './lib/steps/FS-Format.js';

// Use command line arguments to set watch mode.
const builder = new Builder(Bun.argv[2] === '--watch' ? 'watch' : 'build');

// These steps are run during the startup phase only.
builder.setStartUpSteps(
  Step_Bun_Run({ cmd: ['bun', 'install'] }, 'quiet'),
  Step_CleanDirectory(builder.dir.out),
  Step_Format('quiet'),
  //
);

// These steps are run before each processing phase.
builder.setBeforeProcessingSteps();

// Basic setup for a typescript powered project. Typescript files that match
// "*.module.ts" and "*.iife.ts" are bundled and written to the out folder.
// The other typescript files do not produce bundles. Module ("*.module.ts")
// files will not bundle other module files. Instead, they'll import whatever
// exports are needed from other module files. IIFE ("*.iife.ts") files, on
// the other hand, produce fully contained bundles. They do not import anything
// from anywhere. Use them accordingly.

// HTML custom components are a lightweight alternative to web components made
// possible by the processors below.

// The processors are run for every file that added them during every
// processing phase.
builder.setProcessorModules(
  Processor_HTML_CustomComponent(),
  Processor_HTML_ImportConverter(),
  Processor_UserscriptBundler({ define: () => ({ 'process.env.DEVSERVERHOST': JSON.stringify(DEVSERVERHOST) }) }),
  // for hot refresh
  Processor_TypeScript_GenericBundler({ define: () => ({ 'process.env.DEVSERVERHOST': JSON.stringify(DEVSERVERHOST) }) }),
  Processor_TypeScript_GenericBundlerImportRemapper(),
  Processor_BasicWriter([`**/*${pattern.moduleoriife}`, `**/*{.user}${pattern.tstsxjsjsx}`, '**/index.html'], []),
  //
);

// These steps are run after each processing phase.
builder.setAfterProcessingSteps(
  Step_DevServer(),
  //
);

// These steps are run during the shutdown phase only.
builder.setCleanUpSteps();

await builder.start();
