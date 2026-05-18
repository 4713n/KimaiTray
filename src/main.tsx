import React from "react";
import ReactDOM from "react-dom/client";
import { getCurrentWindow } from "@tauri-apps/api/window";
import QueryProvider from "./providers/QueryProvider";
import TrayPopup from "./windows/TrayPopup";
import Settings from "./windows/Settings";
import "./index.css";

const label = getCurrentWindow().label;

function App() {
  switch (label) {
    case "settings":
      return <Settings />;
    case "tray-popup":
    default:
      return (
        <QueryProvider>
          <TrayPopup />
        </QueryProvider>
      );
  }
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
