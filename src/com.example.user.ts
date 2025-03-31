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

import { ElementAddedObserver } from './lib/ericchase/Platform/Web/DOM/MutationObserver/ElementAdded.js';

async function main() {
  if (document && 'adoptedStyleSheets' in document) {
    const stylesheet = new CSSStyleSheet();
    // found this css at https://codepen.io/MauriciAbad/pen/eqvKMx
    stylesheet.replaceSync(`
.rainbow-text{
	position: relative;
	color: #000;
	background: #fff;
	mix-blend-mode: multiply;
  overflow: hidden;
  
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
  padding: 2px 4px 6px;
  margin: -2px -4px -6px;
}
.rainbow-text::before{
	content: "";
	position: absolute;
	top:0;right:0;bottom:0;left:-100%;
	background: white repeating-linear-gradient(90deg, #14ffe9 0%, #ffc800 16.66666%, #ff00e0 33.33333%, #14ffe9 50.0%);
	mix-blend-mode: screen;
	pointer-events: none;
  animation: move 1s linear infinite;
}

@keyframes move{
  0%{transform: translateX(0);}
  100%{transform: translateX(50%);}
}

@supports not (mix-blend-mode: multiply) {
	.rainbow-text{
	-webkit-text-fill-color: transparent;
	background-clip: text !important;
	background: white repeating-linear-gradient(90deg, #14ffe9, #ffc800, #ff00e0, #14ffe9);
    text-shadow: none;
	}
	.rainbow-text::before{ content: none; }
}
    `);
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
}

main();
