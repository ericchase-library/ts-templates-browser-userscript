// ==UserScript==
// @name        @dev--com.example; example userscript
// @match       https://*.example.com/*
// @version     1.0.0
// @description 2025/03/31, 5:38:51 PM
// @run-at      document-start
// @grant       none
// @homepageURL https://github.com/ericchase-library/ts-templates-browser-userscript
// ==/UserScript==

// This is the example that gets bundled into a final publishable UserScript.

import { WebPlatform_DOM_Element_Added_Observer_Class } from './lib/ericchase/WebPlatform_DOM_Element_Added_Observer_Class.js';
import { Async_WebPlatform_DOM_ReadyState_Callback } from './lib/ericchase/WebPlatform_DOM_ReadyState_Callback.js';
import rainbow_text_styles from './rainbow-text.css' assert { type: 'text' };

Async_WebPlatform_DOM_ReadyState_Callback({
  async load() {
    if (document && 'adoptedStyleSheets' in document) {
      const stylesheet = new CSSStyleSheet();
      stylesheet.replaceSync(rainbow_text_styles);
      document.adoptedStyleSheets.push(stylesheet);
    }
    WebPlatform_DOM_Element_Added_Observer_Class({
      selector: 'p',
    }).subscribe(async (element, unsubscribe) => {
      if (element instanceof HTMLParagraphElement) {
        unsubscribe(); // stop the observer after the first p tag
        element.classList.add('rainbow-text');
      }
    });
  },
});
