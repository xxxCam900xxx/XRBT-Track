import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.js'
import Watermark from './assets/widgets/Watermark.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Watermark />
  </StrictMode>,
)
