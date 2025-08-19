// ==UserScript==
// @name        @dev--com.example; example userscript
// @match       https://*.example.com/*
// @version     1.0.0
// @description 2025/03/31, 5:38:51 PM
// @run-at      document-start
// @grant       none
// @homepageURL https://github.com/ericchase-library/ts-templates-browser-userscript
// ==/UserScript==

// src/lib/ericchase/WebPlatform_DOM_Inject_Script.ts
function WebPlatform_DOM_Inject_Script(code, setup_fn) {
  const script = document.createElement('script');
  setup_fn?.(script);
  script.textContent = code;
  document.body.appendChild(script);
  return script;
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
    WebPlatform_DOM_Inject_Script(await fetch(`http://${SERVERHOST()}/com.example; example userscript.user.js`).then((response) => response.text()));
    WebPlatform_DOM_Inject_Script(await fetch(`http://${SERVERHOST()}/lib/server/hot-reload.iife.js`).then((response) => response.text()));
  },
});
