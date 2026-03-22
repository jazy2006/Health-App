import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import GeminiAssistant from './GeminiAssistant';
import {
    Activity,
    Stethoscope,
    Calendar,
    Video,
    Smile,
    Users,
    LogOut,
    Bell,
    History
} from 'lucide-react';

export default function DashboardLayout({ userRole, onLogout }) {
    const patientLinks = [
        { to: '/', icon: <Activity size={20} />, label: 'Health Dashboard' },
        { to: '/symptoms', icon: <Stethoscope size={20} />, label: 'Symptom Checker' },
        { to: '/booking', icon: <Calendar size={20} />, label: 'Book Doctor' },
        { to: '/consultation', icon: <Video size={20} />, label: 'Video Consult' },
        { to: '/mental-health', icon: <Smile size={20} />, label: 'Mental Health' },
        { to: '/family', icon: <Users size={20} />, label: 'Family Sharing' },
        { to: '/history', icon: <History size={20} />, label: 'Activity History' },
    ];

    const doctorLinks = [
        { to: '/', icon: <Activity size={20} />, label: 'Patient Vitals' },
        { to: '/consultation', icon: <Video size={20} />, label: 'Virtual Clinic' },
        { to: '/booking', icon: <Calendar size={20} />, label: 'Appointments' },
    ];

    const familyLinks = [
        { to: '/', icon: <Activity size={20} />, label: 'Family Summary' },
    ];

    const navLinks = userRole === 'doctor' ? doctorLinks : userRole === 'family' ? familyLinks : patientLinks;

    return (
        <>
            <div className="app-container">
                <aside className="sidebar">
                    <div style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                        <div style={{ background: 'var(--primary)', padding: '0.5rem', borderRadius: '50%', color: 'white' }}>
                            <Activity size={24} />
                        </div>
                        <h2 className="gradient-text" style={{ fontSize: '1.5rem', margin: 0 }}>Health Bridge</h2>
                    </div>

                    <nav style={{ flex: 1 }}>
                        <ul style={{ padding: 0 }}>
                            {navLinks.map((link) => (
                                <li key={link.to}>
                                    <NavLink
                                        to={link.to}
                                        end={link.to === '/'}
                                        className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
                                    >
                                        {link.icon}
                                        {link.label}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div style={{ padding: '1rem', borderTop: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <img
                                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
                                alt="User Avatar"
                                className="avatar"
                            />
                            <div>
                                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>John Doe</div>
                                <div style={{ color: 'var(--text-light)', fontSize: '0.75rem', textTransform: 'capitalize' }}>
                                    {userRole} Account
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={onLogout}
                            className="menu-item"
                            style={{ width: '100%', color: 'var(--accent)', background: 'rgba(244, 63, 94, 0.1)' }}
                        >
                            <LogOut size={20} />
                            Sign Out
                        </button>
                    </div>
                </aside>

                <main className="main-content">
                    <header className="header">
                        <div>
                            <h1 style={{ fontSize: '1.875rem', marginBottom: '0.25rem' }}>Welcome back, John! 👋</h1>
                            <p style={{ color: 'var(--text-light)' }}>Here's your health overview for today.</p>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <button className="btn-secondary" style={{ padding: '0.5rem', borderRadius: '50%' }}>
                                <Bell size={20} />
                            </button>
                            <button className="btn-primary" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
                                SOS Emergency
                            </button>
                        </div>
                    </header>

                    <div className="content-wrapper">
                        <Outlet />
                    </div>
                </main>
            </div>
            <GeminiAssistant />
        </>
    );
}
