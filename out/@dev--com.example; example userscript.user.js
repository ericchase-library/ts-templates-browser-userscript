// ==UserScript==
// @name        @dev--com.example; example userscript
// @match       https://*.example.com/*
// @version     1.0.0
// @description 2025/03/31, 5:38:51 PM
// @run-at      document-start
// @grant       GM_addElement
// @homepageURL https://github.com/ericchase-library/ts-templates-browser-userscript
// ==/UserScript==

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

// src/lib/server/info.ts
function SERVERHOST() {
  const CheckENV = () => {
    try {
      return;
    } catch {}
  };
  const CheckCurrentScript = () => {
    try {
      return new URL(document.currentScript.src).host;
    } catch {}
  };
  const CheckMetaUrl = () => {
    try {
      return new URL(undefined).host;
    } catch {}
  };
  const CheckError = () => {
    try {
      return new URL(new Error().fileName).host;
    } catch {}
  };
  return CheckENV() ?? CheckCurrentScript() ?? CheckMetaUrl() ?? CheckError() ?? window.location.host;
}

// src/@dev--com.example; example userscript.user.ts
Async_WebPlatform_DOM_ReadyState_Callback({
  async DOMContentLoaded() {
    GM_addElement('script', { src: `http://${SERVERHOST()}/com.example; example userscript.user.js` });
    GM_addElement('script', { src: `http://${SERVERHOST()}/lib/server/hot-reload.iife.js` });
  },
});
