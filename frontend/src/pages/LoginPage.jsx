import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ArrowLeft } from 'lucide-react';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, error, user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(email, password);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#F1F6F4]">
            <div className="clay-card w-full max-w-md p-12 bg-[#F1F6F4]">
                <Link to="/" className="inline-flex items-center space-x-2 text-[#114C5A] hover:text-[#FFC801] transition-all font-black group">
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Back</span>
                </Link>
                <h1 className="text-4xl font-black text-center text-[#172B36] mb-8 mt-10 tracking-tight">Welcome Back</h1>
                {error && <div className="bg-[#FF9932]/10 text-[#FF9932] p-4 rounded-[16px] mb-8 text-sm text-center font-black shadow-clay-inset border border-[#FF9932]/20 uppercase tracking-widest">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div>
                        <label className="block text-[#114C5A] text-xs font-black uppercase tracking-widest mb-3 ml-1">Email Address</label>
                        <input
                            type="email"
                            className="w-full clay-input"
                            placeholder="name@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-[#114C5A] text-xs font-black uppercase tracking-widest mb-3 ml-1">Secret Key</label>
                        <input
                            type="password"
                            className="w-full clay-input"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="w-full clay-button-primary py-5 text-lg">
                        SECURE LOGIN
                    </button>
                    <p className="text-center text-[#114C5A] font-bold mt-8">
                        New here? <Link to="/register" className="text-[#FF9932] hover:underline">Create Account</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
