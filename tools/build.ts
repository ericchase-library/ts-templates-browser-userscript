import { BunPlatform_Argv_Includes } from '../src/lib/ericchase/BunPlatform_Argv_Includes.js';
import { Step_Dev_Format } from './core-dev/step/Step_Dev_Format.js';
import { Step_Dev_Project_Update_Config } from './core-dev/step/Step_Dev_Project_Update_Config.js';
import { Processor_HTML_Custom_Component_Processor } from './core-web/processor/Processor_HTML_Custom_Component_Processor.js';
import { Processor_HTML_Remove_HotReload_On_Build } from './core-web/processor/Processor_HTML_Remove_HotReload_On_Build.js';
import { DEV_SERVER_HOST, Step_Run_Dev_Server } from './core-web/step/Step_Run_Dev_Server.js';
import { Builder } from './core/Builder.js';
import { PATTERN, Processor_TypeScript_Generic_Bundler } from './core/processor/Processor_TypeScript_Generic_Bundler.js';
import { Step_Bun_Run } from './core/step/Step_Bun_Run.js';
import { Step_FS_Clean_Directory } from './core/step/Step_FS_Clean_Directory.js';
import { Processor_TypeScript_UserScript_Bundler } from './lib-browser-userscript/processors/Processor_TypeScript_UserScript_Bundler.js';
import { Step_Dev_Generate_Links } from './lib-browser-userscript/steps/Step_Dev_Generate_Links.js';

// If needed, add `cache` directory to the logger's file writer.
// await AddLoggerOutputDirectory('cache');

// Use command line arguments to set developer mode.
if (BunPlatform_Argv_Includes('--dev')) {
  Builder.SetMode(Builder.MODE.DEV);
}
// Set the logging verbosity
Builder.SetVerbosity(Builder.VERBOSITY._1_LOG);

// These steps are run during the startup phase only.
Builder.SetStartUpSteps(
  Step_Dev_Project_Update_Config({ project_dir: '.' }),
  Step_Bun_Run({ cmd: ['bun', 'update', '--latest'], showlogs: false }),
  Step_Bun_Run({ cmd: ['bun', 'install'], showlogs: false }),
  Step_FS_Clean_Directory(Builder.Dir.Out),
  //
);

// These steps are run before each processing phase.
Builder.SetBeforeProcessingSteps();

// Basic setup for a TypeScript project. TypeScript files that match
// "*.module.ts" and "*.iife.ts" are bundled and written to the out folder. The
// other TypeScript files do not produce bundles. Module scripts
// ("*.module.ts") will not bundle other module scripts. Instead, they'll
// import whatever exports are needed from other module scripts. IIFE scripts
// ("*.iife.ts"), on the other hand, produce fully contained bundles. They do
// not import anything from anywhere. Use them accordingly.

// HTML custom components are a lightweight alternative to web components made
// possible by the processor I wrote.

// The processors are run for every file that added them during every
// processing phase.
Builder.SetProcessorModules(
  Processor_HTML_Remove_HotReload_On_Build(),
  // Process the HTML custom components.
  Processor_HTML_Custom_Component_Processor(),
  // Bundle the IIFE scripts.
  Processor_TypeScript_Generic_Bundler({ define: () => ({ 'process.env.SERVERHOST': DEV_SERVER_HOST }) }, { bundler_mode: 'iife' }),
  // Bundle the UserScripts.
  Processor_TypeScript_UserScript_Bundler({ define: () => ({ 'process.env.SERVERHOST': DEV_SERVER_HOST }) }),
  //
);

// These steps are run after each processing phase.
Builder.SetAfterProcessingSteps(
  // Generate the HTML file with links to bundled UserScripts.
  Step_Dev_Generate_Links({ dirpath: Builder.Dir.Out, pattern: `**/*{.user}${PATTERN.JS_JSX_TS_TSX}` }),
  // During developer mode (see above), the server will start running with
  // hot-reloading enabled for any of your HTML files that have called the
  // `EnableHotReload();` function in a script.
  Step_Run_Dev_Server(),
  //
);

// These steps are run during the cleanup phase only.
Builder.SetCleanUpSteps(
  Step_Dev_Format({ showlogs: false }),
  //
);

await Builder.Start();
