import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"; // Make sure this imports your CSS with Tailwind directives
import CatSwipeApp from "./App"; // Adjust path based on where you put the component

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <CatSwipeApp />
  </React.StrictMode>
);
