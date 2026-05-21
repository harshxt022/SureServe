import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { SocketProvider } from './context/SocketContext'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AuthProvider>
            <SocketProvider>
                <BrowserRouter>
                    <Toaster position="top-center" reverseOrder={false} />
                    <App />
                </BrowserRouter>
            </SocketProvider>
        </AuthProvider>
    </React.StrictMode>,
)
