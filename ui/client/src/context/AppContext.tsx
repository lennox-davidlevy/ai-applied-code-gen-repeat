import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';

interface AppState {
  socket: Socket | null;
}

interface AppProviderProps {
  children: React.ReactNode;
}

const initialAppState: AppState = {
  socket: null,
};

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, setState] = useState<AppState>(initialAppState);
  const [apiProxy, setApiProxy] = useState<string>('');

  useEffect(() => {
    /**
     * Fetches the API proxy configuration from the server and sets it in the application state.
     *
     * This function sends an asynchronous GET request to the '/api/config' endpoint
     * to retrieve the API proxy configuration. The retrieved configuration is then
     * set in the application state using the `setApiProxy` function.
     *
     * This method is particularly useful when the application is containerized,
     * minified, and deployed to Kubernetes, allowing it to dynamically access environment
     * variables from a minified ReactJS application served by an Express server.
     *
     * @returns A promise that resolves when the API proxy configuration is successfully set.
     * @throws Will log an error message to the console if the request fails.
     */
    async function getApiProxy(): Promise<void> {
      try {
        const result = await axios.get('/api/config');
        setApiProxy(result.data.API_PROXY);
      } catch (err) {
        console.error('Failed to fetch API proxy configuration:', err);
      }
    }
    getApiProxy();
  }, []);

  useEffect(() => {
    if (!apiProxy) {
      console.warn('API Proxy is not set');
      return;
    }

    const socket = io(apiProxy);
    socket.on('connect', () => {
      console.log('Socket connected in context');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from websocket');
    });

    socket.on('connect_error', (error: any) => {
      console.error('Failed to connect to websocket:', error);
    });

    setState((prevState) => ({ ...prevState, socket }));

    return () => {
      console.log('Closing websocket connection');
      if (socket.connected) {
        socket.disconnect();
      }
    };
  }, [apiProxy]);

  return (
    <AppContext.Provider value={{ ...state }}>{children}</AppContext.Provider>
  );
};

export const useAppContext = (): AppState => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
