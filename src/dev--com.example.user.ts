// ==UserScript==
// @name        example.com: example userscript
// @author      ericchase
// @namespace   ericchase
// @match       https://*.example.com/*
// @version     1.0.0
// @description 3/31/2025, 5:38:51 PM
// @run-at      document-start
// @grant       none
// @homepageURL https://github.com/ericchase-library/ts-templates-browser-userscript
// ==/UserScript==

// This is a userscript for use during development. It injects both the example
// userscript and script for reshing the page when relevant files are modified.

import { WebPlatform_DOM_Inject_Script } from './lib/ericchase/WebPlatform_DOM_Inject_Script.js';
import { SERVER_HOST } from './lib/server/constants.js';

(async () => {
  WebPlatform_DOM_Inject_Script(await fetch(`http://${SERVER_HOST}/com.example.user.js`).then((response) => response.text()));
  WebPlatform_DOM_Inject_Script(await fetch(`http://${SERVER_HOST}/dev/hotrefresh.iife.js`).then((response) => response.text()));
})();
