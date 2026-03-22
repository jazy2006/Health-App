import React, { useState, useEffect } from 'react';
import {
    Heart,
    Activity,
    Droplets,
    Moon,
    AlertTriangle,
    Pill,
    Sun,
    Coffee,
    CheckCircle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const dummyData = [
    { time: '08:00', heartRate: 72, bpSys: 120, bpDia: 80, glucose: 95 },
    { time: '10:00', heartRate: 75, bpSys: 122, bpDia: 82, glucose: 105 },
    { time: '12:00', heartRate: 85, bpSys: 135, bpDia: 85, glucose: 140 }, // Spike
    { time: '14:00', heartRate: 78, bpSys: 125, bpDia: 82, glucose: 110 },
    { time: '16:00', heartRate: 70, bpSys: 118, bpDia: 78, glucose: 100 },
    { time: '18:00', heartRate: 72, bpSys: 120, bpDia: 80, glucose: 95 },
];

export default function DashboardPage({ userRole }) {
    const [anomaly, setAnomaly] = useState(true);

    return (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            {/* Target: AI Anomaly Alerts */}
            {anomaly && (
                <div className="card" style={{ background: 'linear-gradient(to right, rgba(244, 63, 94, 0.1), transparent)', borderLeft: '4px solid var(--accent)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ background: 'rgba(244, 63, 94, 0.2)', padding: '0.75rem', borderRadius: '50%', color: 'var(--accent)' }}>
                                <AlertTriangle size={24} />
                            </div>
                            <div>
                                <h3 style={{ color: 'var(--accent)', marginBottom: '0.25rem' }}>AI Anomaly Detected</h3>
                                <p>Abnormal spike in Blood Pressure (135/85 mmHg) detected at 12:00 PM. High risk metric identified.</p>
                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                                    <button className="btn-primary" style={{ background: 'var(--accent)', fontSize: '0.875rem' }}>
                                        Consult Doctor Now
                                    </button>
                                    <button className="btn-secondary" onClick={() => setAnomaly(false)} style={{ fontSize: '0.875rem' }}>
                                        Dismiss
                                    </button>
                                </div>
                            </div>
                        </div>
                        <span className="badge badge-alert">High Priority</span>
                    </div>
                </div>
            )}

            {/* Target: Live Health Dashboard */}
            <div>
                <h2 style={{ marginBottom: '1rem' }}>Live Vitals</h2>
                <div className="grid grid-cols-3">
                    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ background: 'rgba(244, 63, 94, 0.1)', padding: '1rem', borderRadius: '50%', color: 'var(--accent)' }}>
                            <Heart size={32} />
                        </div>
                        <div>
                            <p style={{ color: 'var(--text-light)', fontSize: '0.875rem', fontWeight: 500 }}>Heart Rate</p>
                            <div className="vital-value">72 <span className="vital-unit">bpm</span></div>
                            <span className="badge badge-success">Normal</span>
                        </div>
                    </div>

                    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ background: 'rgba(14, 165, 233, 0.1)', padding: '1rem', borderRadius: '50%', color: 'var(--primary)' }}>
                            <Activity size={32} />
                        </div>
                        <div>
                            <p style={{ color: 'var(--text-light)', fontSize: '0.875rem', fontWeight: 500 }}>Blood Pressure</p>
                            <div className="vital-value">120/80 <span className="vital-unit">mmHg</span></div>
                            <span className="badge badge-success">Optimal</span>
                        </div>
                    </div>

                    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '50%', color: 'var(--secondary)' }}>
                            <Droplets size={32} />
                        </div>
                        <div>
                            <p style={{ color: 'var(--text-light)', fontSize: '0.875rem', fontWeight: 500 }}>Glucose Level</p>
                            <div className="vital-value">95 <span className="vital-unit">mg/dL</span></div>
                            <span className="badge badge-success">Healthy</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3">

                {/* Real-time Charts */}
                <div className="card" style={{ gridColumn: 'span 2' }}>
                    <div className="card-header">
                        <h3>Vitals Trend Today</h3>
                        <select style={{ width: 'auto', padding: '0.25rem 0.5rem' }}>
                            <option>Today</option>
                            <option>This Week</option>
                        </select>
                    </div>
                    <div style={{ height: '300px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={dummyData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                <XAxis dataKey="time" stroke="var(--text-light)" />
                                <YAxis stroke="var(--text-light)" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderRadius: '0.5rem' }}
                                />
                                <Line type="monotone" dataKey="heartRate" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4 }} name="Heart Rate" />
                                <Line type="monotone" dataKey="bpSys" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4 }} name="BP Sys" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Target: Medication Reminders & Daily Tips */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    <div className="card">
                        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Pill size={20} color="var(--primary)" /> Medication Schedule
                        </h3>
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'var(--background)', borderRadius: 'var(--radius-md)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <CheckCircle size={20} color="var(--secondary)" />
                                    <div>
                                        <div style={{ fontWeight: 500 }}>Lisinopril (BP)</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>10mg • After Breakfast</div>
                                    </div>
                                </div>
                                <span className="badge badge-success">Taken</span>
                            </li>
                            <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(14, 165, 233, 0.05)', border: '1px solid rgba(14, 165, 233, 0.2)', borderRadius: 'var(--radius-md)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid var(--primary)' }}></div>
                                    <div>
                                        <div style={{ fontWeight: 500 }}>Metformin</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>500mg • After Lunch (2:00 PM)</div>
                                    </div>
                                </div>
                                <button className="btn-primary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>Mark Taken</button>
                            </li>
                        </ul>
                    </div>

                    <div className="card glass-panel" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), transparent)' }}>
                        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Sun size={20} color="var(--secondary)" /> Daily Wellness Tip
                        </h3>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text)' }}>
                            <strong>Air Quality Alert:</strong> PM2.5 levels are high today. Consider indoor breathing exercises and stay hydrated!
                        </p>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                            <span className="badge" style={{ background: 'var(--surface)' }}><Coffee size={12} /> Hydration</span>
                            <span className="badge" style={{ background: 'var(--surface)' }}>Breathing Eq.</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
