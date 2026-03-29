import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'        // ← This line must exist and point to your CSS file
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
        <BrowserRouter>

         <App />
        </BrowserRouter>
  </React.StrictMode>
)
