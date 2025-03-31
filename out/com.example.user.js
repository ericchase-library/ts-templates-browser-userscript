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

// src/lib/ericchase/Platform/Web/DOM/MutationObserver/ElementAdded.ts
class ElementAddedObserver {
  constructor({
    source = document.documentElement,
    options = { subtree: true },
    selector,
    includeExistingElements = true
  }) {
    this.mutationObserver = new MutationObserver((mutationRecords) => {
      for (const record of mutationRecords) {
        if (record.target instanceof Element && record.target.matches(selector)) {
          this.send(record.target);
        }
        const treeWalker = document.createTreeWalker(record.target, NodeFilter.SHOW_ELEMENT);
        while (treeWalker.nextNode()) {
          if (treeWalker.currentNode.matches(selector)) {
            this.send(treeWalker.currentNode);
          }
        }
      }
    });
    this.mutationObserver.observe(source, {
      childList: true,
      subtree: options.subtree ?? true
    });
    if (includeExistingElements === true) {
      const treeWalker = document.createTreeWalker(document, NodeFilter.SHOW_ELEMENT);
      while (treeWalker.nextNode()) {
        if (treeWalker.currentNode.matches(selector)) {
          this.send(treeWalker.currentNode);
        }
      }
    }
  }
  disconnect() {
    this.mutationObserver.disconnect();
    for (const callback of this.subscriptionSet) {
      this.subscriptionSet.delete(callback);
    }
  }
  subscribe(callback) {
    this.subscriptionSet.add(callback);
    let abort = false;
    for (const element of this.matchSet) {
      callback(element, () => {
        this.subscriptionSet.delete(callback);
        abort = true;
      });
      if (abort)
        return () => {};
    }
    return () => {
      this.subscriptionSet.delete(callback);
    };
  }
  mutationObserver;
  matchSet = new Set;
  subscriptionSet = new Set;
  send(element) {
    if (!this.matchSet.has(element)) {
      this.matchSet.add(element);
      for (const callback of this.subscriptionSet) {
        callback(element, () => {
          this.subscriptionSet.delete(callback);
        });
      }
    }
  }
}

// src/com.example.user.ts
async function main() {
  if (document && "adoptedStyleSheets" in document) {
    const stylesheet = new CSSStyleSheet;
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
    selector: "p"
  }).subscribe(async (element, unsubscribe) => {
    if (element instanceof HTMLParagraphElement) {
      unsubscribe();
      element.classList.add("rainbow-text");
    }
  });
}
main();
