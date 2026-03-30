import { useState, useCallback, useEffect } from 'react';

export const useOfflineSync = (API_BASE_URL) => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncQueue, setSyncQueue] = useState(() => {
        const saved = localStorage.getItem('syncQueue');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    useEffect(() => {
        localStorage.setItem('syncQueue', JSON.stringify(syncQueue));
    }, [syncQueue]);

    const addToQueue = (action, data) => {
        setSyncQueue(prev => [...prev, { id: `temp_${Date.now()}`, action, data, timestamp: Date.now() }]);
    };

    return { isOnline, isSyncing, setIsSyncing, syncQueue, setSyncQueue, addToQueue };
};
