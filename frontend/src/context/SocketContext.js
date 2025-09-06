import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      const newSocket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000', {
        auth: {
          userId: user.id,
        },
      });

      newSocket.on('connect', () => {
        setConnected(true);
        console.log('Socket connected');
      });

      newSocket.on('disconnect', () => {
        setConnected(false);
        console.log('Socket disconnected');
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [isAuthenticated, user]);

  const joinProject = (projectId) => {
    if (socket) {
      socket.emit('join-project', projectId);
    }
  };

  const leaveProject = (projectId) => {
    if (socket) {
      socket.emit('leave-project', projectId);
    }
  };

  const sendMessage = (projectId, message) => {
    if (socket) {
      socket.emit('send-message', {
        projectId,
        message,
        user: user,
        timestamp: new Date(),
      });
    }
  };

  const sendNotification = (userId, notification) => {
    if (socket) {
      socket.emit('send-notification', {
        userId,
        notification,
      });
    }
  };

  const value = {
    socket,
    connected,
    joinProject,
    leaveProject,
    sendMessage,
    sendNotification,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
