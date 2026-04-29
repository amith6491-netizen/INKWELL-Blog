import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#2e2115',
              color: '#faf8f3',
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '14px',
              borderRadius: '0',
              border: '1px solid #473522',
            },
            success: { iconTheme: { primary: '#b3a07a', secondary: '#2e2115' } },
            error:   { iconTheme: { primary: '#ef4444', secondary: '#faf8f3' } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
