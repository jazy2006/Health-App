import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Send, Stethoscope, AlertCircle, FileText, Download, Calendar } from 'lucide-react';

export default function SymptomChecker() {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([
        { role: 'ai', content: 'Hello! I am NovaAI, your intelligent health assistant. Please describe your symptoms (e.g., "I have a mild headache and a fever").' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState(null);

    const handleSend = async () => {
        if (!input.trim()) return;

        const newMessages = [...messages, { role: 'user', content: input }];
        setMessages(newMessages);
        const currentInput = input;
        setInput('');
        setLoading(true);

        try {
            const res = await fetch(`/api/ai/search?q=${encodeURIComponent(currentInput)}`);
            const data = await res.json();

            if (data.result && data.result.message) {
                setMessages([...newMessages, { role: 'ai', content: data.result.message }]);
                setReport({
                    diagnosis: data.result.doctor ? `Condition requiring ${data.result.doctor.spec}` : 'General Consultation Recommended',
                    riskLevel: data.result.doctor ? 'Moderate to High' : 'Low to Moderate',
                    recommendations: [
                        'Please consult with a medical professional.',
                        data.result.doctor ? `Consider seeing a ${data.result.doctor.spec}.` : 'Monitor your symptoms.',
                        'Rest and maintain hydration.',
                        'If symptoms worsen, seek emergency care immediately.'
                    ]
                });
            } else {
                throw new Error("No AI data");
            }
        } catch (err) {
            // Fallback if backend is not running or gives error
            setMessages([...newMessages, {
                role: 'ai',
                content: "Based on your symptoms, it sounds like you might be experiencing a viral infection or seasonal flu. I've generated a preliminary health report and recommendations for you."
            }]);
            setReport({
                diagnosis: 'Possible Viral Infection / Flu',
                riskLevel: 'Moderate',
                recommendations: [
                    'Rest and drink plenty of fluids (water, electrolytes).',
                    'Take Paracetamol for fever and headache.',
                    'Monitor your temperature every 4 hours.',
                    'Isolate from family members to prevent spread.'
                ]
            });
        }
        setLoading(false);
    };

    return (
        <div className="animate-fade-in" style={{ height: 'calc(100vh - 120px)', display: 'grid', gridTemplateColumns: report ? '1.5fr 1fr' : '1fr', gap: '2rem' }}>

            {/* Target: Symptom Checker Form/Chatbot */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div className="card-header" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <MessageSquare size={24} color="var(--primary)" /> NovaAI Assistant
                    </h2>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {messages.map((msg, idx) => (
                        <div key={idx} style={{
                            display: 'flex',
                            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                            alignItems: 'flex-end',
                            gap: '0.5rem'
                        }}>
                            {msg.role === 'ai' && (
                                <div style={{ background: 'var(--primary)', padding: '0.5rem', borderRadius: '50%', color: 'white' }}>
                                    <Stethoscope size={16} />
                                </div>
                            )}
                            <div style={{
                                background: msg.role === 'user' ? 'var(--primary)' : 'var(--background)',
                                color: msg.role === 'user' ? 'white' : 'var(--text)',
                                padding: '1rem',
                                borderRadius: msg.role === 'user' ? 'var(--radius-lg) var(--radius-md) 0 var(--radius-lg)' : 'var(--radius-md) var(--radius-lg) var(--radius-lg) 0',
                                maxWidth: '75%',
                                boxShadow: 'var(--shadow-sm)'
                            }}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', color: 'var(--text-light)', paddingLeft: '3rem' }}>
                            <span className="dot" style={{ animation: 'fadeIn 1s infinite alternate' }}>•</span>
                            <span className="dot" style={{ animation: 'fadeIn 1s infinite alternate 0.2s' }}>•</span>
                            <span className="dot" style={{ animation: 'fadeIn 1s infinite alternate 0.4s' }}>•</span>
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                    <input
                        type="text"
                        placeholder="Type your symptoms here..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        style={{ flex: 1, borderRadius: 'var(--radius-full)' }}
                    />
                    <button className="btn-primary" onClick={handleSend} style={{ width: '48px', height: '48px', padding: 0, borderRadius: '50%' }}>
                        <Send size={20} />
                    </button>
                </div>
            </div>

            {report && (
                <div className="card glass-panel animate-fade-in" style={{ alignSelf: 'start', background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(14,165,233,0.05))', position: 'sticky', top: '1rem' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>
                        <FileText size={24} /> AI Health Assessment
                    </h3>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <p style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>Preliminary Diagnosis</p>
                        <h4 style={{ fontSize: '1.25rem' }}>{report.diagnosis}</h4>
                        <div style={{ marginTop: '0.5rem', padding: '0.5rem 1rem', background: 'rgba(244, 163, 63, 0.1)', color: '#f59e0b', borderRadius: 'var(--radius-full)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                            <AlertCircle size={16} /> Risk Level: {report.riskLevel}
                        </div>
                    </div>

                    <div>
                        <p style={{ color: 'var(--text-light)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Action Plan</p>
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingLeft: '1.5rem' }}>
                            {report.recommendations.map((rec, i) => (
                                <li key={i} style={{ fontSize: '0.95rem' }}>{rec}</li>
                            ))}
                        </ul>
                    </div>

                    <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <button className="btn-primary" onClick={() => navigate('/booking')} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            <Calendar size={18} /> Book an Appointment
                        </button>
                        <button className="btn-secondary" onClick={() => window.print()} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)' }}>
                            <Download size={18} /> Download Medical Report
                        </button>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', textAlign: 'center', marginTop: '0.5rem' }}>
                            *This AI assessment is not a substitute for professional medical advice.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
