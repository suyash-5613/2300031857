import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "@/App";
import { initLogging } from "@/middleware/logging";
import "@/styles/global.css";

initLogging();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);