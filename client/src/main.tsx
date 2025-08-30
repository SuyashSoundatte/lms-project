import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

import { registerSW } from "virtual:pwa-register";

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm("New version available. Reload?")) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log("PWA is ready for offline use");
  },
});

createRoot(document.getElementById("root")!).render(<App />);
