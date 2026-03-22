import React, { useState, useEffect } from 'react';
import { Smile, Frown, Meh, Wind, Activity, HeartPulse } from 'lucide-react';

export default function MentalHealth() {
    const [breathing, setBreathing] = useState(false);
    const [phase, setPhase] = useState('Inhale'); // Inhale, Hold, Exhale
    const [timer, setTimer] = useState(4);
    const [mood, setMood] = useState(null);

    useEffect(() => {
        let interval;
        if (breathing) {
            interval = setInterval(() => {
                setTimer((prev) => {
                    if (prev > 1) return prev - 1;

                    if (phase === 'Inhale') { setPhase('Hold'); return 7; }
                    if (phase === 'Hold') { setPhase('Exhale'); return 8; }
                    setPhase('Inhale'); return 4;
                });
            }, 1000);
        } else {
            setPhase('Inhale');
            setTimer(4);
        }
        return () => clearInterval(interval);
    }, [breathing, phase]);

    return (
        <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>

            {/* Target: Mental Health & Stress Monitoring */}

            {/* Mood Tracking */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="card-header">
                    <h3>Daily Mood Tracker</h3>
                    <span className="badge badge-info">Today</span>
                </div>
                <p style={{ color: 'var(--text-light)' }}>How are you feeling right now?</p>

                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                    {[
                        { id: 'sad', icon: <Frown size={32} />, label: 'Low', color: '#f43f5e' },
                        { id: 'neutral', icon: <Meh size={32} />, label: 'Okay', color: '#f59e0b' },
                        { id: 'happy', icon: <Smile size={32} />, label: 'Great', color: '#10b981' }
                    ].map(m => (
                        <button
                            key={m.id}
                            onClick={() => setMood(m.id)}
                            style={{
                                flex: 1,
                                padding: '1.5rem',
                                borderRadius: 'var(--radius-lg)',
                                border: `2px solid ${mood === m.id ? m.color : 'var(--border)'}`,
                                background: mood === m.id ? `${m.color}15` : 'transparent',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '0.5rem',
                                color: mood === m.id ? m.color : 'var(--text-light)',
                                transition: 'all 0.2s'
                            }}
                        >
                            {m.icon}
                            <span style={{ fontWeight: 500 }}>{m.label}</span>
                        </button>
                    ))}
                </div>

                {mood && (
                    <div className="animate-fade-in" style={{ marginTop: '1rem', background: 'var(--background)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                        <p style={{ fontSize: '0.875rem' }}>Your mood has been logged. Based on your recent check-ins, your overall stress score is <strong>32/100 (Low Stress)</strong>.</p>
                    </div>
                )}

                <div style={{ flex: 1 }}></div>

                <div className="card glass-panel" style={{ background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.1), transparent)', border: 'none' }}>
                    <h4 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Activity size={20} color="var(--primary)" /> Stress Bio-Signals
                    </h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>Heart Rate Variability (HRV): 45ms. <br />You are currently in a balanced state.</p>
                </div>
            </div>

            {/* Guided Breathing */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', background: 'linear-gradient(to bottom, var(--surface), rgba(16, 185, 129, 0.05))' }}>
                <h3 style={{ marginBottom: '0.5rem' }}>Guided Box Breathing</h3>
                <p style={{ color: 'var(--text-light)', marginBottom: '3rem' }}>4-7-8 Technique to reduce stress instantly.</p>

                <div style={{ position: 'relative', width: '250px', height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '3rem' }}>
                    <div style={{
                        position: 'absolute',
                        width: breathing ? (phase === 'Inhale' ? '250px' : phase === 'Exhale' ? '100px' : '250px') : '100px',
                        height: breathing ? (phase === 'Inhale' ? '250px' : phase === 'Exhale' ? '100px' : '250px') : '100px',
                        borderRadius: '50%',
                        background: 'rgba(16, 185, 129, 0.2)',
                        transition: `all ${phase === 'Hold' ? '0s' : 'linear'} ${phase === 'Inhale' ? 4 : phase === 'Exhale' ? 8 : 0}s`,
                        zIndex: 1
                    }}></div>
                    <div style={{
                        position: 'absolute',
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        background: 'var(--secondary)',
                        boxShadow: 'var(--shadow-glow)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        zIndex: 2,
                        transition: 'transform 0.5s'
                    }}>
                        <Wind size={40} />
                    </div>
                </div>

                {breathing ? (
                    <div>
                        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--secondary)' }}>{phase}</h2>
                        <p style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-light)' }}>{timer}s</p>
                    </div>
                ) : (
                    <div>
                        <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Ready to relax?</h2>
                    </div>
                )}

                <div style={{ flex: 1 }}></div>

                <button
                    className="btn-primary"
                    style={{ width: '100%', marginTop: '2rem', background: breathing ? 'var(--accent)' : 'var(--secondary)' }}
                    onClick={() => setBreathing(!breathing)}
                >
                    {breathing ? 'Stop Exercise' : 'Start Breathing Session'}
                </button>
            </div>

        </div>
    );
}
