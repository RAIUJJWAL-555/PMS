import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ArrowLeft } from 'lucide-react';

const RegisterPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user' });
    const { register, error, user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await register(formData);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#F1F6F4]">
            <div className="clay-card w-full max-w-md p-10 bg-[#F1F6F4]">
                <Link to="/" className="inline-flex items-center space-x-2 text-[#114C5A] hover:text-[#FFC801] transition-all font-black group">
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Back</span>
                </Link>
                <h1 className="text-4xl font-black text-center text-[#172B36] mb-8 mt-10 tracking-tight">Join the Team</h1>
                {error && <div className="bg-[#FF9932]/10 text-[#FF9932] p-4 rounded-[16px] mb-8 text-sm text-center font-black shadow-clay-inset border border-[#FF9932]/20 uppercase tracking-widest">{error}</div>}

                <form onSubmit={handleSubmit} className="p-2 space-y-6">
                    <div>
                        <label className="block text-[#114C5A] text-xs font-black uppercase tracking-widest mb-2 ml-1">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            className="w-full clay-input"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-[#114C5A] text-xs font-black uppercase tracking-widest mb-2 ml-1">Work Email</label>
                        <input
                            type="email"
                            name="email"
                            className="w-full clay-input"
                            placeholder="name@company.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-[#114C5A] text-xs font-black uppercase tracking-widest mb-2 ml-1">Security Pass</label>
                        <input
                            type="password"
                            name="password"
                            className="w-full clay-input"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-[#114C5A] text-xs font-black uppercase tracking-widest mb-2 ml-1">Team Role</label>
                        <select
                            name="role"
                            className="w-full clay-input appearance-none cursor-pointer"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value="user" className="bg-[#F1F6F4] text-[#172B36]">Strategic User</option>
                            <option value="admin" className="bg-[#F1F6F4] text-[#172B36]">Workspace Admin</option>
                        </select>
                    </div>

                    <button type="submit" className="w-full clay-button-primary py-5 text-lg mt-4 font-black">
                        CREATE ACCOUNT
                    </button>
                    <p className="text-center text-[#114C5A] font-bold mt-8">
                        Already joined? <Link to="/login" className="text-[#FF9932] hover:underline">Sign In</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
