import React, { useState } from 'react';
import { Camera, Mic, PhoneOff, Settings, Minimize2, MessageSquare, Plus } from 'lucide-react';

export default function VideoConsultation() {
    const [micOn, setMicOn] = useState(true);
    const [camOn, setCamOn] = useState(true);
    const [inCall, setInCall] = useState(false);

    return (
        <div className="animate-fade-in" style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>

            {/* Target: Video Consultation Portal */}
            {!inCall ? (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="card animate-fade-in" style={{ textAlign: 'center', maxWidth: '500px', width: '100%' }}>
                        <div style={{ background: 'rgba(14, 165, 233, 0.1)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--primary)' }}>
                            <Camera size={40} />
                        </div>
                        <h2 style={{ marginBottom: '0.5rem' }}>Ready to join the virtual clinic?</h2>
                        <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>Dr. Sarah Jenkins is waiting for you.</p>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
                            <button
                                onClick={() => setMicOn(!micOn)}
                                style={{ width: '60px', height: '60px', borderRadius: '50%', background: micOn ? 'var(--surface)' : 'rgba(244, 63, 94, 0.1)', color: micOn ? 'var(--text)' : 'var(--accent)', border: `1px solid ${micOn ? 'var(--border)' : 'var(--accent)'}` }}
                            >
                                <Mic size={24} style={{ margin: 'auto' }} />
                            </button>
                            <button
                                onClick={() => setCamOn(!camOn)}
                                style={{ width: '60px', height: '60px', borderRadius: '50%', background: camOn ? 'var(--surface)' : 'rgba(244, 63, 94, 0.1)', color: camOn ? 'var(--text)' : 'var(--accent)', border: `1px solid ${camOn ? 'var(--border)' : 'var(--accent)'}` }}
                            >
                                <Camera size={24} style={{ margin: 'auto' }} />
                            </button>
                            <button style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--surface)', border: '1px solid var(--border)' }}>
                                <Settings size={24} style={{ margin: 'auto' }} />
                            </button>
                        </div>

                        <button
                            className="btn-primary"
                            style={{ width: '100%', fontSize: '1.25rem', padding: '1rem' }}
                            onClick={() => setInCall(true)}
                        >
                            Join Appointment
                        </button>
                    </div>
                </div>
            ) : (
                <div style={{ flex: 1, background: '#000', borderRadius: 'var(--radius-xl)', overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>

                    <div style={{ position: 'absolute', top: '2rem', left: '2rem', zIndex: 10, display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span className="badge" style={{ background: 'rgba(244, 63, 94, 0.4)', color: 'white', backdropFilter: 'blur(4px)' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)', marginRight: '0.5rem', animation: 'fadeIn 1s infinite alternate' }} />
                            REC
                        </span>
                        <span style={{ color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.5)', fontWeight: 500 }}>12:45</span>
                    </div>

                    {/* Main Video Area (Doctor) */}
                    <img
                        src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1200&q=80"
                        alt="Doctor Feed"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />

                    {/* Self View (Patient) */}
                    <div style={{ position: 'absolute', bottom: '6rem', right: '2rem', width: '200px', height: '300px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.2)', boxShadow: 'var(--shadow-lg)' }}>
                        <img
                            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80"
                            alt="Self Feed"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </div>

                    {/* Controls */}
                    <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', padding: '1rem 2rem', borderRadius: 'var(--radius-full)', display: 'flex', gap: '1.5rem' }}>
                        <button
                            onClick={() => setMicOn(!micOn)}
                            style={{ width: '50px', height: '50px', borderRadius: '50%', background: micOn ? 'rgba(255,255,255,0.2)' : 'var(--accent)', color: 'white', border: 'none', transition: 'all 0.2s' }}
                        >
                            <Mic size={20} style={{ margin: 'auto' }} />
                        </button>
                        <button
                            onClick={() => setCamOn(!camOn)}
                            style={{ width: '50px', height: '50px', borderRadius: '50%', background: camOn ? 'rgba(255,255,255,0.2)' : 'var(--accent)', color: 'white', border: 'none', transition: 'all 0.2s' }}
                        >
                            <Camera size={20} style={{ margin: 'auto' }} />
                        </button>
                        <button
                            style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', transition: 'all 0.2s' }}
                        >
                            <MessageSquare size={20} style={{ margin: 'auto' }} />
                        </button>
                        <button
                            onClick={() => setInCall(false)}
                            style={{ width: '80px', height: '50px', borderRadius: 'var(--radius-full)', background: 'var(--accent)', color: 'white', border: 'none', transition: 'all 0.2s' }}
                        >
                            <PhoneOff size={20} style={{ margin: 'auto' }} />
                        </button>
                    </div>

                </div>
            )}
        </div>
    );
}
