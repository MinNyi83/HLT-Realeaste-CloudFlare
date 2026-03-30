import { useState, useEffect } from 'react';

export const useAuth = (API_BASE_URL) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            if (!API_BASE_URL) return;
            try {
                const res = await fetch(`${API_BASE_URL}/api/auth/me`, { credentials: 'include' });
                const data = await res.json();
                if (data.user) {
                    setUser(data.user);
                    localStorage.setItem('user_cache', JSON.stringify(data.user));
                } else {
                    setUser(null);
                    localStorage.removeItem('user_cache');
                }
            } catch (err) {
                const cachedUser = localStorage.getItem('user_cache');
                if (cachedUser) setUser(JSON.parse(cachedUser));
            }
        };
        checkAuth();
    }, [API_BASE_URL]);

    return { user, setUser, isLoading, setIsLoading };
};
