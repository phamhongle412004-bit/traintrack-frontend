import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { BasketProvider } from './context/BasketContext'
import { ErrorBoundary } from './components/ErrorBoundary'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* ErrorBoundary đặt ở ngoài cùng để bắt mọi lỗi render phát sinh từ Context hoặc App */}
    <ErrorBoundary>
      <AuthProvider>
        <BasketProvider>
          <App />
        </BasketProvider>
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>,
)