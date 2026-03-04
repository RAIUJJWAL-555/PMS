import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Shield, Briefcase, CheckSquare } from 'lucide-react';

const Dashboard = () => {
    const { user, logout } = useAuth();

    return (
        <div style={{ minHeight: '100vh', background: '#0d0e12' }}>
            {/* Header / Navbar */}
            <nav style={{
                background: 'rgba(26, 28, 34, 0.8)',
                backdropFilter: 'blur(12px)',
                padding: '0 40px',
                height: '72px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                position: 'sticky',
                top: 0,
                zIndex: 100
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        background: 'var(--primary)',
                        padding: '8px',
                        borderRadius: '10px'
                    }}>
                        <Briefcase size={24} color="white" />
                    </div>
                    <span style={{ fontSize: '1.25rem', fontWeight: '700', color: 'white' }}>TaskMaster</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                            width: '36px',
                            height: '36px',
                            background: '#2d3142',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <User size={18} color="var(--primary)" />
                        </div>
                        <div style={{ textAlign: 'left', lineHeight: '1.2' }}>
                            <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>{user?.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{user?.role}</div>
                        </div>
                    </div>

                    <button
                        onClick={logout}
                        className="btn"
                        style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            color: '#ef4444',
                            padding: '8px 16px',
                            fontSize: '0.85rem'
                        }}
                    >
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </nav>

            {/* Dashboard Content */}
            <main className="container" style={{ padding: '40px 20px' }}>
                <div style={{ marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>
                        Hello, {user?.name.split(' ')[0]} 👋
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Welcome to your team task management dashboard.</p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '24px'
                }}>
                    {/* Stats Card */}
                    <div style={{
                        background: 'var(--card-bg)',
                        padding: '30px',
                        borderRadius: '20px',
                        border: '1px solid rgba(255, 255, 255, 0.05)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Role Assigned</h3>
                            <div style={{
                                padding: '6px 12px',
                                background: 'rgba(99, 102, 241, 0.1)',
                                color: 'var(--primary)',
                                borderRadius: '30px',
                                fontSize: '0.8rem',
                                fontWeight: '600',
                                textTransform: 'uppercase',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}>
                                <Shield size={14} /> {user?.role}
                            </div>
                        </div>
                        <p style={{ color: 'white', marginBottom: '10px' }}>
                            {user?.role === 'admin'
                                ? 'You have full access to manage projects and tasks.'
                                : 'You can view and complete tasks assigned to you.'}
                        </p>
                    </div>

                    {/* Quick Action Card (Placeholder for now) */}
                    <div style={{
                        background: 'var(--card-bg)',
                        padding: '30px',
                        borderRadius: '20px',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: '0.05' }}>
                            <CheckSquare size={100} color="white" />
                        </div>
                        <h3 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>Your Tasks</h3>
                        <p style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '4px' }}>0</p>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Tasks assigned to you</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
