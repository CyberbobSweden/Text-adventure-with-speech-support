import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Registering a service worker is required by Chrome/Android before it will
// treat the site as installable (Add to Home Screen -> launches with no
// address bar / nav bar, i.e. real fullscreen). Safe to skip silently on
// browsers or dev servers that don't support it.
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => undefined);
  });
}
