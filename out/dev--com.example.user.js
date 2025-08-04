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

// src/lib/ericchase/WebPlatform_DOM_Inject_Script.ts
function WebPlatform_DOM_Inject_Script(code) {
  const script = document.createElement("script");
  script.textContent = code;
  document.body.appendChild(script);
  return script;
}

// src/lib/server/constants.ts
var SERVER_HOST = "127.0.0.1:8000";

// src/dev--com.example.user.ts
(async () => {
  WebPlatform_DOM_Inject_Script(await fetch(`http://${SERVER_HOST}/com.example.user.js`).then((response) => response.text()));
  WebPlatform_DOM_Inject_Script(await fetch(`http://${SERVER_HOST}/dev/hotrefresh.iife.js`).then((response) => response.text()));
})();
