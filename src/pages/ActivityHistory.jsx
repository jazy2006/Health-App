import React, { useState, useEffect } from 'react';
import { History, Activity as ActivityIcon } from 'lucide-react';

export default function ActivityHistory() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newActivity, setNewActivity] = useState('');

    const fetchHistory = () => {
        fetch(`/api/history`)
            .then(res => res.json())
            .then(data => {
                setHistory(data.history || []);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const handleAddActivity = async () => {
        if (!newActivity.trim()) return;
        try {
            await fetch(`/api/history`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: newActivity })
            });
            setNewActivity('');
            fetchHistory();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="animate-fade-in" style={{ display: 'grid', gap: '2rem' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2>Activity & Care History</h2>
                    <p style={{ color: 'var(--text-light)' }}>A timeline of all your engagements and actions in Health Bridge.</p>
                </div>
            </div>

            <div className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <ActivityIcon size={24} color="var(--primary)" />
                <input
                    type="text"
                    placeholder="Manually add a health activity or note (e.g., 'Took morning vitamins')..."
                    value={newActivity}
                    onChange={(e) => setNewActivity(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddActivity()}
                    style={{ flex: 1, border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '0.75rem', background: 'var(--background)' }}
                />
                <button className="btn-primary" onClick={handleAddActivity} style={{ whiteSpace: 'nowrap' }}>
                    + Record Log
                </button>
            </div>

            <div className="card">
                {loading ? (
                    <p>Loading history...</p>
                ) : history.length === 0 ? (
                    <p>No activity found.</p>
                ) : (
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative' }}>
                        {/* Timeline line */}
                        <div style={{ position: 'absolute', left: '23px', top: '10px', bottom: '10px', width: '2px', background: 'var(--border)' }}></div>

                        {history.map((item, idx) => (
                            <li key={idx} style={{ display: 'flex', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
                                <div style={{
                                    background: 'var(--primary)', color: 'white', padding: '0.5rem',
                                    borderRadius: '50%', width: '48px', height: '48px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    boxShadow: '0 0 0 4px var(--surface)'
                                }}>
                                    <History size={20} />
                                </div>
                                <div style={{ background: 'var(--background)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', flex: 1, border: '1px solid var(--border)' }}>
                                    <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{item.action}</h4>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>
                                        {new Date(item.date).toLocaleString()}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

        </div>
    );
}
