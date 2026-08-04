import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { BasketProvider } from './context/BasketContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BasketProvider>
        <App />
      </BasketProvider>
    </AuthProvider>
  </StrictMode>,
)
