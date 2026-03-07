import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        if (userInfo) {
            setUser(userInfo);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            setError(null);
            const { data } = await axios.post('/api/auth/login', { email, password });
            sessionStorage.setItem('userInfo', JSON.stringify(data));
            setUser(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    const register = async (userData) => {
        try {
            setError(null);
            const { data } = await axios.post('/api/auth/register', userData);
            sessionStorage.setItem('userInfo', JSON.stringify(data));
            setUser(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    const logout = () => {
        sessionStorage.clear();
        setUser(null);
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, error }}>
            {children}
        </AuthContext.Provider>
    );
};
