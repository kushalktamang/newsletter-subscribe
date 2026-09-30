import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './app.tsx'

const rootElement = document.querySelector("#root")
if(rootElement === null) {
  throw new Error("root element is empty")
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
