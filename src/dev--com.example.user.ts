// ==UserScript==
// @name        example.com: example userscript
// @author      ericchase
// @namespace   ericchase
// @match       https://example.com/*
// @version     1.0.0
// @description 3/31/2025, 5:38:51 PM
// @run-at      document-start
// @grant       none
// @homepageURL https://github.com/ericchase-library/ts-templates-browser-userscript
// ==/UserScript==

// This is a userscript for use during development. It injects both the example
// userscript and script for reshing the page when relevant files are modified.

import { InjectScript } from './lib/ericchase/Platform/Web/InjectScript.js';
import { SERVER_HOST } from './lib/server/constants.js';

(async () => {
  InjectScript(await fetch(`http://${SERVER_HOST}/com.example.user.js`).then((response) => response.text()));
  InjectScript(await fetch(`http://${SERVER_HOST}/lib/server/hotrefresh.iife.js`).then((response) => response.text()));
})();
