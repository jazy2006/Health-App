import React, { useState } from 'react';
import { Users, Link, Copy, Mail, ShieldCheck, UserPlus, HeartPulse, Activity } from 'lucide-react';

export default function FamilySharing() {
    const [email, setEmail] = useState('');
    const [sending, setSending] = useState(false);
    const [status, setStatus] = useState(null);
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        setCopied(true);
        navigator.clipboard.writeText("https://healthbridge.app/share/johndoe-xyz89");
        setTimeout(() => setCopied(false), 2000);
    };

    const sendInvitation = async () => {
        if (!email || sending) return;
        setSending(true);
        setStatus(null);

        try {
            const res = await fetch(`/api/invite`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            if (data.success) {
                setStatus('success');
                setEmail('');
            } else {
                setStatus('error');
            }
        } catch {
            setStatus('error');
        }
        setSending(false);
        setTimeout(() => setStatus(null), 3000);
    };

    return (
        <>
            {/* Success Toast */}
            {status === 'success' && (
                <div className="animate-fade-in" style={{
                    position: 'fixed', top: '2rem', right: '2rem', zIndex: 1000,
                    background: '#10b981', color: 'white', padding: '1rem 2rem',
                    borderRadius: 'var(--radius-md)', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                    display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 600
                }}>
                    <ShieldCheck size={24} />
                    Invitation Sent Successfully!
                </div>
            )}

            <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>

                {/* Target: Family Health Sharing Dashboard */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="card">
                        <div className="card-header">
                            <h3>Shared Health Summary</h3>
                            <span className="badge badge-success">Live Sync Active</span>
                        </div>
                        <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem' }}>This is the read-only summary visible to your authorized family members.</p>

                        <div className="grid grid-cols-2" style={{ gap: '1rem', marginBottom: '1.5rem' }}>
                            <div style={{ background: 'var(--background)', padding: '1rem', borderRadius: 'var(--radius-lg)' }}>
                                <p style={{ color: 'var(--text-light)', fontSize: '0.875rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <HeartPulse size={16} color="var(--primary)" /> Avg Heart Rate
                                </p>
                                <h4 style={{ fontSize: '1.5rem', marginTop: '0.25rem' }}>74 bpm</h4>
                            </div>
                            <div style={{ background: 'var(--background)', padding: '1rem', borderRadius: 'var(--radius-lg)' }}>
                                <p style={{ color: 'var(--text-light)', fontSize: '0.875rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Activity size={16} color="var(--secondary)" /> Daily Activity
                                </p>
                                <h4 style={{ fontSize: '1.5rem', marginTop: '0.25rem' }}>6,240 <span style={{ fontSize: '0.875rem', color: 'var(--text-light)', fontWeight: 400 }}>steps</span></h4>
                            </div>
                        </div>

                        <div style={{ background: 'rgba(244, 63, 94, 0.05)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
                            <h4 style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}>Recent Alerts</h4>
                            <p style={{ fontSize: '0.875rem' }}>No critical alerts in the past 24 hours. Blood pressure remains stable.</p>
                        </div>
                    </div>

                    <div className="card">
                        <h3 style={{ marginBottom: '1rem' }}>Manage Access</h3>
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {[
                                { name: 'Sarah Doe', relation: 'Spouse', access: 'Full summary & Alerts' },
                                { name: 'Robert Doe', relation: 'Son', access: 'Emergency Alerts Only' }
                            ].map((member, i) => (
                                <li key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: i === 0 ? '1px solid var(--border)' : 'none', paddingBottom: i === 0 ? '1rem' : 0 }}>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <div style={{ background: 'var(--background)', padding: '0.75rem', borderRadius: '50%', color: 'var(--text-light)' }}>
                                            <Users size={20} />
                                        </div>
                                        <div>
                                            <h4 style={{ fontSize: '1rem' }}>{member.name}
                                                <span className="badge" style={{ marginLeft: '0.5rem', background: 'var(--background)', color: 'var(--text-light)' }}>
                                                    {member.relation}
                                                </span>
                                            </h4>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{member.access}</p>
                                        </div>
                                    </div>
                                    <button className="btn-secondary" style={{ color: 'var(--accent)', fontSize: '0.875rem' }}>Revoke</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="card glass-panel" style={{ alignSelf: 'start', background: 'linear-gradient(wrap, rgba(14, 165, 233, 0.05), transparent)' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <UserPlus size={24} color="var(--primary)" /> Invite Family
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginBottom: '1.5rem' }}>
                        Share your health dashboard link securely. They will get a daily digest.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', display: 'block' }}>Secure Invite Link</label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                    type="text"
                                    readOnly
                                    value={`${window.location.origin}/share/johndoe-xyz89`}
                                    style={{ flex: 1, fontSize: '0.875rem', background: 'var(--background)' }}
                                />
                                <button
                                    className="btn-primary"
                                    onClick={handleCopy}
                                    style={{ padding: '0.5rem 1rem', background: copied ? 'var(--secondary)' : 'var(--primary)' }}
                                >
                                    {copied ? <ShieldCheck size={18} /> : <Copy size={18} />}
                                </button>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '0.5rem 0' }}>
                            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 500 }}>OR EMAIL INVITATION</span>
                            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
                        </div>

                        <div>
                            <label style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', display: 'block' }}>Email Address</label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                    type="email"
                                    placeholder="family@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={{ flex: 1, fontSize: '0.875rem', border: status === 'error' ? '1px solid var(--accent)' : '1px solid var(--border)' }}
                                />
                                <button
                                    onClick={sendInvitation}
                                    disabled={sending || !email}
                                    className="btn-secondary"
                                    style={{ padding: '0.5rem 1rem' }}
                                >
                                    {status === 'success' ? <ShieldCheck size={18} color="#4ade80" /> : <Mail size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={sendInvitation}
                            disabled={sending || !email}
                            className="btn-primary"
                            style={{
                                marginTop: '1rem', width: '100%',
                                background: status === 'success' ? '#4ade80' : status === 'error' ? 'var(--accent)' : 'var(--primary)'
                            }}
                        >
                            {sending ? 'Sending...' : status === 'success' ? 'Invitation Sent!' : status === 'error' ? 'Failed to Send' : 'Send Invitation'}
                        </button>
                    </div>
                </div>

            </div>
            );
}
