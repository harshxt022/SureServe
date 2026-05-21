import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const { token } = useAuth();
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (token) {
            const getSocketUrl = () => {
                if (import.meta.env.VITE_API_URL) {
                    return import.meta.env.VITE_API_URL.replace('/api', '');
                }
                if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                    if (window.location.port !== '5000') {
                        return 'http://localhost:5000';
                    }
                }
                return window.location.origin;
            };
            const newSocket = io(getSocketUrl(), {
                auth: { token }
            });
            setSocket(newSocket);

            return () => newSocket.close();
        } else {
            if (socket) {
                socket.close();
                setSocket(null);
            }
        }
    }, [token]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
