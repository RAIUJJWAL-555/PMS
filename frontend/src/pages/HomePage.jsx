import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const HomePage = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <div className="min-h-screen text-[#172B36] selection:bg-[#FFC801]/30 font-semibold bg-[#F1F6F4]">
            {/* Navbar */}
            <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center sticky top-4 z-50 bg-[#F1F6F4]/85 backdrop-blur-[12px] rounded-[24px] shadow-clay border border-[#114C5A]/10 mt-4">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#FFC801] to-[#FF9932] rounded-[16px] flex items-center justify-center font-black text-xl text-[#172B36] shadow-clay-yellow border border-white/50">P</div>
                    <span className="text-2xl font-black tracking-tight text-[#172B36]">PMS</span>
                </div>
                <div className="flex items-center space-x-6">
                    {user ? (
                        <>
                            <Link to="/dashboard" className="clay-button-primary px-8 py-3 text-sm">Dashboard</Link>
                            <button onClick={logout} className="px-6 py-3 text-[#FF9932] hover:bg-[#FF9932]/10 rounded-[16px] transition-all font-black">Log Out</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="px-6 py-3 text-[#114C5A] hover:bg-[#D9E8E2] rounded-[16px] transition-all font-black">Login</Link>
                            <Link to="/register" className="clay-button-primary px-8 py-3 text-sm">Get Started</Link>
                        </>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <main className="max-w-7xl mx-auto px-6 pt-32 pb-24 text-center">
                <h1 className="text-7xl font-black mb-6 leading-tight text-[#172B36] max-w-4xl mx-auto">
                    Manage your team <br />
                    <span className="bg-gradient-to-r from-[#FFC801] to-[#FF9932] bg-clip-text text-transparent">with bold precision.</span>
                </h1>
                <p className="text-[#114C5A] text-xl font-bold mb-12 max-w-2xl mx-auto opacity-80 uppercase tracking-widest">
                    The ultra-modern workspace for modern teams.
                </p>
                <div className="flex justify-center space-x-8">
                    {user ? (
                        <Link to="/dashboard" className="clay-button-primary px-12 py-6 text-lg">
                            Go to Dashboard
                        </Link>
                    ) : (
                        <Link to="/register" className="clay-button-primary px-12 py-6 text-lg">
                            Start FREE Now
                        </Link>
                    )}
                    <button className="clay-card-mint px-12 py-6 text-lg font-black text-[#114C5A] flex items-center space-x-3 border-none">
                        <span>See Demo</span>
                    </button>
                </div>

                {/* Feature Preview */}
                <div className="mt-40 grid grid-cols-1 md:grid-cols-3 gap-12">
                    {[
                        { title: 'Rapid Tasks', desc: 'Create and assign tasks in seconds with our fluid UI.', icon: '⚡' },
                        { title: 'Deep Metrics', desc: 'Track team performance with stunning analytics.', icon: '📊' },
                        { title: 'Global Sync', desc: 'Stay updated across all devices in real-time.', icon: '🌍' }
                    ].map((feature, i) => (
                        <div key={i} className="clay-card p-12 text-left group hover:-translate-y-4 transition-all duration-500 border border-[#114C5A]/5">
                            <div className="w-16 h-16 bg-gradient-to-br from-[#FFC801] to-[#FF9932] rounded-[20px] flex items-center justify-center text-3xl mb-8 shadow-clay-yellow border border-white/50 group-hover:scale-110 transition-transform">
                                {feature.icon}
                            </div>
                            <h3 className="text-2xl font-black mb-4 text-[#172B36]">{feature.title}</h3>
                            <p className="text-[#114C5A] font-bold leading-relaxed opacity-70">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </main>

            <footer className="py-12 text-center text-sandstone/50 text-sm font-black">
                &copy; 2024 Project Management System. Build with ❤️ by Ujjwal.
            </footer>
        </div>
    );
};

export default HomePage;
