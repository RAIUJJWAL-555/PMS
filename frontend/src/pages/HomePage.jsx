import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div className="min-h-screen bg-gray-900 text-white selection:bg-blue-500/30">
            {/* Navbar */}
            <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center bg-gray-900 sticky top-0 z-50 border-b border-gray-800">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xl">P</div>
                    <span className="text-xl font-bold tracking-tight">PMS</span>
                </div>
                <div className="space-x-4">
                    <Link to="/login" className="px-4 py-2 text-gray-400 hover:text-white transition">Sign In</Link>
                    <Link to="/register" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition shadow-lg shadow-blue-500/20">Get Started</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="max-w-7xl mx-auto px-6 pt-24 pb-32 text-center">
                <h1 className="text-5xl md:text-7xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-600 tracking-tight leading-tight">
                    Manage Projects Like <br className="hidden md:block" /> A Productivity Pro.
                </h1>
                <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
                    Streamline your team's workflow, track mission-critical tasks, and hit project milestones with our high-performance management dashboard.
                </p>
                <Link to="/register" className="inline-block px-10 py-5 bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-bold rounded-2xl transition transform hover:scale-105 shadow-2xl shadow-indigo-500/30">
                    Get Started For Free
                </Link>
            </main>

            {/* Feature Highlights */}
            <section className="bg-gray-800/50 py-24 border-y border-gray-800">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                    <div className="p-8 rounded-2xl bg-gray-900 border border-gray-800 hover:border-blue-500/50 transition duration-300">
                        <div className="text-4xl text-blue-500 mb-6 font-bold">📂</div>
                        <h3 className="text-2xl font-bold mb-4">Project Insights</h3>
                        <p className="text-gray-400 leading-relaxed font-light">Get a bird's eye view of all your team's ongoing projects in one unified dashboard.</p>
                    </div>
                    <div className="p-8 rounded-2xl bg-gray-900 border border-gray-800 hover:border-blue-500/50 transition duration-300">
                        <div className="text-4xl text-blue-500 mb-6 font-bold">⚡</div>
                        <h3 className="text-2xl font-bold mb-4">Task Tracking</h3>
                        <p className="text-gray-400 leading-relaxed font-light">Efficiently assign, monitor, and update status of individual tasks across the team.</p>
                    </div>
                    <div className="p-8 rounded-2xl bg-gray-900 border border-gray-800 hover:border-blue-500/50 transition duration-300">
                        <div className="text-4xl text-blue-500 mb-6 font-bold">🛡️</div>
                        <h3 className="text-2xl font-bold mb-4">Role Controls</h3>
                        <p className="text-gray-400 leading-relaxed font-light">Built-in role management to secure your workspace and admin operations.</p>
                    </div>
                </div>
            </section>

            <footer className="py-12 border-t border-gray-800 text-center text-gray-500 text-sm">
                &copy; 2024 Project Management System. Build with ❤️ by Ujjwal.
            </footer>
        </div>
    );
};

export default HomePage;
