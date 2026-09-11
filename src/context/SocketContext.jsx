import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { API_BASE_URL } from '../utils/api';

const SocketContext = createContext();

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        let newSocket;
        try {
            newSocket = io(API_BASE_URL, {
                withCredentials: true,
                autoConnect: false,
                transports: ['polling', 'websocket'],
                timeout: 5000
            });

            newSocket.on('connect', () => {
                console.log('Socket connected');
                setIsConnected(true);
            });

            newSocket.on('disconnect', () => {
                console.log('Socket disconnected');
                setIsConnected(false);
            });

            newSocket.on('connect_error', (err) => {
                // Silently handle socket failure in environments where sockets are unavailable
                console.warn('Socket connection unavailable:', err?.message || err);
                setIsConnected(false);
            });

            setSocket(newSocket);
        } catch (e) {
            console.warn('Socket initialization skipped:', e);
        }

        return () => {
            if (newSocket) newSocket.close();
        };
    }, []);

    const connectSocket = () => {
        if (socket && !isConnected) {
            socket.connect();
        }
    };

    const disconnectSocket = () => {
        if (socket && isConnected) {
            socket.disconnect();
        }
    };

    return (
        <SocketContext.Provider value={{
            socket,
            isConnected,
            connectSocket,
            disconnectSocket
        }}>
            {children}
        </SocketContext.Provider>
    );
};
