import React, { useState } from 'react';
import { Activity, Shield, Users, Stethoscope } from 'lucide-react';

export default function Login({ onLogin }) {
    const [role, setRole] = useState('patient');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email && password) {
            onLogin(role);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card animate-fade-in">
                <div className="auth-header">
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                        <div style={{ background: 'var(--primary)', padding: '1rem', borderRadius: '50%', color: 'white' }}>
                            <Activity size={32} />
                        </div>
                    </div>
                    <h1 className="gradient-text">Health Bridge</h1>
                    <p style={{ color: 'var(--text-light)' }}>Smart Healthcare Platform</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Login As</label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                            <button
                                type="button"
                                className={`btn-secondary ${role === 'patient' ? 'active' : ''}`}
                                style={{ borderColor: role === 'patient' ? 'var(--primary)' : 'var(--border)', background: role === 'patient' ? 'rgba(14, 165, 233, 0.1)' : 'transparent' }}
                                onClick={() => setRole('patient')}
                            >
                                <Users size={16} /> Patient
                            </button>
                            <button
                                type="button"
                                className={`btn-secondary ${role === 'doctor' ? 'active' : ''}`}
                                style={{ borderColor: role === 'doctor' ? 'var(--primary)' : 'var(--border)', background: role === 'doctor' ? 'rgba(14, 165, 233, 0.1)' : 'transparent' }}
                                onClick={() => setRole('doctor')}
                            >
                                <Stethoscope size={16} /> Doctor
                            </button>
                            <button
                                type="button"
                                className={`btn-secondary ${role === 'family' ? 'active' : ''}`}
                                style={{ borderColor: role === 'family' ? 'var(--primary)' : 'var(--border)', background: role === 'family' ? 'rgba(14, 165, 233, 0.1)' : 'transparent' }}
                                onClick={() => setRole('family')}
                            >
                                <Shield size={16} /> Family
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                        Sign In Securely
                    </button>
                </form>
            </div>
        </div>
    );
}
