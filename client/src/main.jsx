import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter as Router } from 'react-router-dom'
import { QueryProvider } from './providers/QueryProvider.jsx'
import { AuthProvider } from './providers/AuthProvider.jsx'
import { Toaster } from "@/components/ui/sonner"

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <QueryProvider>
        <AuthProvider>
          <App />
          <Toaster />
        </AuthProvider>
      </QueryProvider>
    </Router>
  </React.StrictMode>,
)
