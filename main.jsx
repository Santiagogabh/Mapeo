import React from "react";
import { createRoot } from "react-dom/client";
import Dashboard from "./Dashboard";

function mountDashboard() {
  const container = document.getElementById("mapeo-dashboard");

  if (!container) return;

  // evita doble montaje
  if (container.__reactRoot) return;

  container.__reactRoot = createRoot(container);
  container.__reactRoot.render(<Dashboard />);
}

// WordPress-safe
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mountDashboard);
} else {
  mountDashboard();
}
