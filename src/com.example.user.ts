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

// This is the example that gets bundled into a final publishable userscript.

import { ElementAddedObserver } from './lib/ericchase/Platform/Web/DOM/MutationObserver/ElementAdded.js';
import rainbow_text_styles from './rainbow-text.css' assert { type: 'text' };

if (document && 'adoptedStyleSheets' in document) {
  const stylesheet = new CSSStyleSheet();
  stylesheet.replaceSync(rainbow_text_styles);
  document.adoptedStyleSheets.push(stylesheet);
}

new ElementAddedObserver({
  selector: 'p',
}).subscribe(async (element, unsubscribe) => {
  if (element instanceof HTMLParagraphElement) {
    unsubscribe(); // stop the observer after the first p tag
    element.classList.add('rainbow-text');
  }
});
