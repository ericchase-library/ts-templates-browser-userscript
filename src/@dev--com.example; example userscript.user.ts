// ==UserScript==
// @name        @dev--com.example; example userscript
// @match       https://*.example.com/*
// @version     1.0.0
// @description 2025/03/31, 5:38:51 PM
// @run-at      document-start
// @grant       GM_addElement
// @homepageURL https://github.com/ericchase-library/ts-templates-browser-userscript
// ==/UserScript==

// This is a UserScript for use during development. It injects both the example
// UserScript and script for refreshing the page when relevant files are
// modified.

import { Async_WebPlatform_DOM_ReadyState_Callback } from './lib/ericchase/WebPlatform_DOM_ReadyState_Callback.js';
import { SERVERHOST } from './lib/server/info.js';

Async_WebPlatform_DOM_ReadyState_Callback({
  async DOMContentLoaded() {
    // We are able to bypass browser CSP features through the UserScript
    // manager's dedicated API. In the future, I'd like to automatically
    // generate these dev scripts via build tools.
    GM_addElement('script', { src: `http://${SERVERHOST()}/com.example; example userscript.user.js` });
    GM_addElement('script', { src: `http://${SERVERHOST()}/lib/server/hot-reload.iife.js` });
  },
});
