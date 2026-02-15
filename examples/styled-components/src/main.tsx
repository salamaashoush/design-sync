import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { GlobalThemeStyle } from "./tokens/light";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GlobalThemeStyle />
    <App />
  </React.StrictMode>,
);
