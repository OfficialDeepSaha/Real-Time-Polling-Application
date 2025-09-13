import * as React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Make React available globally for components that need it
(window as any).React = React;

createRoot(document.getElementById("root")!).render(<App />);
