// ==UserScript==
// @name        @dev--com.example; example userscript
// @match       https://*.example.com/*
// @version     1.0.0
// @description 2025/03/31, 5:38:51 PM
// @run-at      document-start
// @grant       none
// @homepageURL https://github.com/ericchase-library/ts-templates-browser-userscript
// ==/UserScript==

// src/lib/ericchase/WebPlatform_DOM_Element_Added_Observer_Class.ts
class Class_WebPlatform_DOM_Element_Added_Observer_Class {
  config;
  $match_set = new Set();
  $mutation_observer;
  $subscription_set = new Set();
  constructor(config) {
    this.config = {
      include_existing_elements: config.include_existing_elements ?? true,
      options: {
        subtree: config.options?.subtree ?? true,
      },
      selector: config.selector,
      source: config.source ?? document.documentElement,
    };
    this.$mutation_observer = new MutationObserver((mutationRecords) => {
      const sent_set = new Set();
      for (const record of mutationRecords) {
        for (const node of record.addedNodes) {
          const tree_walker = document.createTreeWalker(node, NodeFilter.SHOW_ELEMENT);
          const processCurrentNode = () => {
            if (sent_set.has(tree_walker.currentNode) === false) {
              if (tree_walker.currentNode instanceof Element && tree_walker.currentNode.matches(this.config.selector) === true) {
                this.$send(tree_walker.currentNode);
                sent_set.add(tree_walker.currentNode);
              }
            }
          };
          processCurrentNode();
          if (this.config.options.subtree === true) {
            while (tree_walker.nextNode()) {
              processCurrentNode();
            }
          }
        }
      }
    });
    this.$mutation_observer.observe(this.config.source, {
      childList: true,
      subtree: this.config.options.subtree,
    });
    if (this.config.include_existing_elements === true) {
      if (this.config.options.subtree === true) {
        const sent_set = new Set();
        const tree_walker = document.createTreeWalker(this.config.source, NodeFilter.SHOW_ELEMENT);
        const processCurrentNode = () => {
          if (sent_set.has(tree_walker.currentNode) === false) {
            if (tree_walker.currentNode instanceof Element && tree_walker.currentNode.matches(this.config.selector) === true) {
              this.$send(tree_walker.currentNode);
              sent_set.add(tree_walker.currentNode);
            }
          }
        };
        while (tree_walker.nextNode()) {
          processCurrentNode();
        }
      } else {
        for (const child of this.config.source.childNodes) {
          if (child instanceof Element && child.matches(this.config.selector) === true) {
            this.$send(child);
          }
        }
      }
    }
  }
  disconnect() {
    this.$mutation_observer.disconnect();
    for (const callback of this.$subscription_set) {
      this.$subscription_set.delete(callback);
    }
  }
  subscribe(callback) {
    this.$subscription_set.add(callback);
    let abort = false;
    for (const element of this.$match_set) {
      callback(element, () => {
        this.$subscription_set.delete(callback);
        abort = true;
      });
      if (abort) {
        return () => {};
      }
    }
    return () => {
      this.$subscription_set.delete(callback);
    };
  }
  $send(element) {
    this.$match_set.add(element);
    for (const callback of this.$subscription_set) {
      callback(element, () => {
        this.$subscription_set.delete(callback);
      });
    }
  }
}
function WebPlatform_DOM_Element_Added_Observer_Class(config) {
  return new Class_WebPlatform_DOM_Element_Added_Observer_Class(config);
}

// src/lib/ericchase/WebPlatform_DOM_ReadyState_Callback.ts
async function Async_WebPlatform_DOM_ReadyState_Callback(config) {
  async function DOMContentLoaded() {
    removeEventListener('DOMContentLoaded', DOMContentLoaded);
    await config.DOMContentLoaded?.();
  }
  async function load() {
    removeEventListener('load', load);
    await config.load?.();
  }
  switch (document.readyState) {
    case 'loading':
      if (config.DOMContentLoaded !== undefined) {
        addEventListener('DOMContentLoaded', DOMContentLoaded);
      }
      if (config.load !== undefined) {
        addEventListener('load', load);
      }
      break;
    case 'interactive':
      await config.DOMContentLoaded?.();
      if (config.load !== undefined) {
        addEventListener('load', load);
      }
      break;
    case 'complete':
      await config.DOMContentLoaded?.();
      await config.load?.();
      break;
  }
}

// src/rainbow-text.css
var rainbow_text_default = `/* Found this stylesheet at https://codepen.io/MauriciAbad/pen/eqvKMx */

.rainbow-text {
  position: relative;
  color: #000;
  background: #fff;
  mix-blend-mode: multiply;
  overflow: hidden;

  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  padding: 2px 4px 6px;
  margin: -2px -4px -6px;
}
.rainbow-text::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: -100%;
  background: white repeating-linear-gradient(90deg, #14ffe9 0%, #ffc800 16.66666%, #ff00e0 33.33333%, #14ffe9 50%);
  mix-blend-mode: screen;
  pointer-events: none;
  animation: move 2s linear infinite;
}

@keyframes move {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(50%);
  }
}

@supports not (mix-blend-mode: multiply) {
  .rainbow-text {
    -webkit-text-fill-color: transparent;
    background-clip: text !important;
    background-color: white repeating-linear-gradient(90deg, #14ffe9, #ffc800, #ff00e0, #14ffe9);
    text-shadow: none;
  }
  .rainbow-text::before {
    content: none;
  }
}
`;

// src/com.example; example userscript.user.ts
Async_WebPlatform_DOM_ReadyState_Callback({
  async load() {
    if (document && 'adoptedStyleSheets' in document) {
      const stylesheet = new CSSStyleSheet();
      stylesheet.replaceSync(rainbow_text_default);
      document.adoptedStyleSheets.push(stylesheet);
    }
    WebPlatform_DOM_Element_Added_Observer_Class({
      selector: 'p',
    }).subscribe(async (element, unsubscribe) => {
      if (element instanceof HTMLParagraphElement) {
        unsubscribe();
        element.classList.add('rainbow-text');
      }
    });
  },
});
