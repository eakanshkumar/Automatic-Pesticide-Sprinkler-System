import React, { useEffect, useRef, useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';

export const useWebSocket = (url, onMessage) => {
  const ws = useRef(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 2; // Further reduced
  const [isConnected, setIsConnected] = useState(false);
  const reconnectTimeoutRef = useRef(null);

  const connect = useCallback(() => {
    try {
      // Check if WebSocket is supported
      if (typeof WebSocket === 'undefined') {
        console.warn('WebSocket is not supported in this environment');
        return;
      }

      // Check if WebSockets are enabled
      const websocketsEnabled = import.meta.env.VITE_ENABLE_WEBSOCKETS === 'true';
      if (!websocketsEnabled) {
        console.log('WebSockets are disabled by configuration');
        return;
      }

      // Check if URL is valid
      if (!url || url.includes('undefined') || url.includes('null')) {
        console.error('Invalid WebSocket URL:', url);
        return;
      }

      // Don't try to connect if already connected or connecting
      if (ws.current && (ws.current.readyState === WebSocket.OPEN || ws.current.readyState === WebSocket.CONNECTING)) {
        return;
      }

      console.log('Connecting to WebSocket:', url);
      ws.current = new WebSocket(url);
      
      // Set timeout to detect failed connections
      const connectionTimeout = setTimeout(() => {
        if (ws.current && ws.current.readyState === WebSocket.CONNECTING) {
          console.log('WebSocket connection timeout');
          ws.current.close();
        }
      }, 5000); // 5 second timeout

      ws.current.onopen = () => {
        clearTimeout(connectionTimeout);
        console.log('WebSocket connected successfully');
        reconnectAttempts.current = 0;
        setIsConnected(true);
      };

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error, event.data);
        }
      };

      ws.current.onclose = (event) => {
        clearTimeout(connectionTimeout);
        console.log('WebSocket disconnected:', event.code, event.reason);
        setIsConnected(false);
        
        // Don't attempt to reconnect if it was a normal closure
        if (event.code === 1000 || event.code === 1001) {
          console.log('Normal WebSocket closure, not reconnecting');
          return;
        }

        // Clear any existing timeout
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }

        // Attempt to reconnect with exponential backoff
        if (reconnectAttempts.current < maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 5000); // Max 5 seconds
          reconnectAttempts.current++;
          
          console.log(`Reconnecting in ${delay}ms (attempt ${reconnectAttempts.current})`);
          reconnectTimeoutRef.current = setTimeout(() => connect(), delay);
        } else {
          console.log('Max reconnection attempts reached - server may be offline');
        }
      };

      ws.current.onerror = (error) => {
        clearTimeout(connectionTimeout);
        console.error('WebSocket connection error - server may not be running WebSocket support');
      };

    } catch (error) {
      console.error('WebSocket connection failed:', error);
    }
  }, [url, onMessage]);

  const disconnect = useCallback(() => {
    if (ws.current) {
      // Clear any pending reconnection attempts
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      
      // Reset reconnection attempts
      reconnectAttempts.current = 0;
      
      // Close connection with normal closure code
      if (ws.current.readyState === WebSocket.OPEN || ws.current.readyState === WebSocket.CONNECTING) {
        ws.current.close(1000, 'Normal closure');
      }
      
      ws.current = null;
      setIsConnected(false);
    }
  }, []);

  useEffect(() => {
    // Only connect if URL is provided, valid, and WebSockets are enabled
    const websocketsEnabled = import.meta.env.VITE_ENABLE_WEBSOCKETS === 'true';
    if (websocketsEnabled && url && !url.includes('undefined')) {
      connect();
    }

    return () => {
      // Cleanup on unmount
      disconnect();
    };
  }, [connect, disconnect, url]);

  return { isConnected };
};