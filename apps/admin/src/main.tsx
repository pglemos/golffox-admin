import React from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./ui/App"

const rootElement = document.getElementById("root")

if (!rootElement) {
  document.body.innerHTML = '<pre style="padding:16px;color:#f00;background:#111;font-family:monospace">Root element not found.</pre>'
} else {
  try {
    createRoot(rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    )
  } catch (err) {
    console.error(err)
    rootElement.innerHTML = `<pre style="padding:16px;color:#f00;background:#111;font-family:monospace;white-space:pre-wrap">$${
      err instanceof Error ? err.stack ?? err.message : String(err)
    }</pre>`
  }
}
