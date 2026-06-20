import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './app/App.css'
import App from './app/App.tsx'
import "./app/i18n.ts"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
