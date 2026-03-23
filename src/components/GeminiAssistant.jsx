import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Bot, User, Minimize2 } from 'lucide-react';

const WELCOME = "Hello! I'm **Bridge AI**, your personal health assistant for Health Bridge! 💊\n\nAsk me anything about symptoms, medications, healthy habits, or mental wellness — I'm here to help!";

export default function GeminiAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'ai', text: WELCOME }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [hasUnread, setHasUnread] = useState(false);
    const [isOnline, setIsOnline] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const res = await fetch('/health');
                setIsOnline(res.ok);
            } catch {
                setIsOnline(false);
            }
        };
        checkStatus();
        const interval = setInterval(checkStatus, 30000); // Check every 30s
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (isOpen) {
            setHasUnread(false);
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);


    const sendMessage = async () => {
        if (!input.trim() || loading) return;
        const userText = input.trim();
        setInput('');
        const newMessages = [...messages, { role: 'user', text: userText }];
        setMessages(newMessages);
        setLoading(true);

        try {
            const res = await fetch(`/api/ai/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userText,
                    history: newMessages.slice(-6) // send last 6 messages for context
                })
            });
            const data = await res.json();
            const reply = data.reply || "I'm sorry, I couldn't process that. Please try again.";
            setMessages(prev => [...prev, { role: 'ai', text: reply }]);
            if (!isOpen) setHasUnread(true);
        } catch {
            setMessages(prev => [...prev, { role: 'ai', text: "⚠️ Backend is offline. Please start the backend server and try again." }]);
        }
        setLoading(false);
    };

    const formatText = (text) =>
        text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br/>');

    return (
        <>
            {/* Floating Chat Button */}
            {!isOpen && (
                <button
                    onClick={() => { setIsOpen(true); setHasUnread(false); }}
                    style={{
                        position: 'fixed', bottom: '2rem', right: '2rem',
                        width: '60px', height: '60px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                        color: 'white', boxShadow: '0 4px 24px rgba(139,92,246,0.5)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 1000, border: 'none', cursor: 'pointer',
                        animation: 'pulse 2s infinite',
                        transition: 'transform 0.2s'
                    }}
                    title="Ask Nova AI"
                >
                    {hasUnread && (
                        <span style={{
                            position: 'absolute', top: '-4px', right: '-4px',
                            width: '18px', height: '18px', background: '#f43f5e',
                            borderRadius: '50%', fontSize: '0.65rem', fontWeight: 700,
                            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: '2px solid white'
                        }}>1</span>
                    )}
                    <Sparkles size={26} />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div style={{
                    position: 'fixed', bottom: '2rem', right: '2rem',
                    width: '380px',
                    height: isMinimized ? '60px' : '540px',
                    borderRadius: '1.25rem',
                    background: 'var(--surface)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                    display: 'flex', flexDirection: 'column',
                    zIndex: 1000, overflow: 'hidden',
                    border: '1px solid rgba(139,92,246,0.2)',
                    transition: 'height 0.3s ease'
                }}>
                    {/* Header */}
                    <div style={{
                        background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                        padding: '1rem 1.25rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        flexShrink: 0
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{
                                width: '36px', height: '36px', borderRadius: '50%',
                                background: 'rgba(255,255,255,0.2)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
                            }}>
                                <Bot size={20} />
                            </div>
                            <div>
                                <div style={{ color: 'white', fontWeight: 700, fontSize: '0.95rem' }}>Bridge AI</div>
                                <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: isOnline ? '#4ade80' : '#f43f5e', display: 'inline-block' }}></span>
                                    {isOnline ? 'Powered by Gemini' : 'Gemini Offline'}
                                </div>

                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                                onClick={() => setIsMinimized(!isMinimized)}
                                style={{ color: 'rgba(255,255,255,0.8)', padding: '0.25rem' }}
                                title="Minimize"
                            >
                                <Minimize2 size={16} />
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                style={{ color: 'rgba(255,255,255,0.8)', padding: '0.25rem' }}
                                title="Close"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    {!isMinimized && (
                        <>
                            {/* Messages Area */}
                            <div style={{
                                flex: 1, overflowY: 'auto', padding: '1rem',
                                display: 'flex', flexDirection: 'column', gap: '0.75rem',
                                background: 'var(--background)'
                            }}>
                                {messages.map((msg, i) => (
                                    <div key={i} style={{
                                        display: 'flex',
                                        justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                        gap: '0.5rem', alignItems: 'flex-end'
                                    }}>
                                        {msg.role === 'ai' && (
                                            <div style={{
                                                width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                                                background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
                                            }}>
                                                <Bot size={14} />
                                            </div>
                                        )}
                                        <div style={{
                                            maxWidth: '78%',
                                            padding: '0.65rem 0.9rem',
                                            borderRadius: msg.role === 'user'
                                                ? '1rem 1rem 0.1rem 1rem'
                                                : '1rem 1rem 1rem 0.1rem',
                                            background: msg.role === 'user'
                                                ? 'linear-gradient(135deg, #8b5cf6, #3b82f6)'
                                                : 'var(--surface)',
                                            color: msg.role === 'user' ? 'white' : 'var(--text)',
                                            fontSize: '0.875rem',
                                            lineHeight: 1.5,
                                            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                                            border: msg.role === 'ai' ? '1px solid var(--border)' : 'none'
                                        }}
                                            dangerouslySetInnerHTML={{ __html: formatText(msg.text) }}
                                        />
                                        {msg.role === 'user' && (
                                            <div style={{
                                                width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                                                background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
                                            }}>
                                                <User size={14} />
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {loading && (
                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
                                        <div style={{
                                            width: '28px', height: '28px', borderRadius: '50%',
                                            background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0
                                        }}>
                                            <Bot size={14} />
                                        </div>
                                        <div style={{
                                            padding: '0.75rem 1rem', borderRadius: '1rem 1rem 1rem 0.1rem',
                                            background: 'var(--surface)', border: '1px solid var(--border)',
                                            display: 'flex', gap: '4px', alignItems: 'center'
                                        }}>
                                            {[0, 0.2, 0.4].map((delay, i) => (
                                                <span key={i} style={{
                                                    width: '7px', height: '7px', borderRadius: '50%',
                                                    background: '#8b5cf6',
                                                    animation: `bounce 1s infinite ${delay}s`
                                                }} />
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <div style={{
                                padding: '0.75rem 1rem',
                                borderTop: '1px solid var(--border)',
                                background: 'var(--surface)',
                                display: 'flex', gap: '0.5rem', alignItems: 'center'
                            }}>
                                <input
                                    type="text"
                                    placeholder="Ask about symptoms, health tips..."
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                                    style={{
                                        flex: 1, borderRadius: '2rem', padding: '0.6rem 1rem',
                                        fontSize: '0.875rem', border: '1px solid var(--border)',
                                        background: 'var(--background)'
                                    }}
                                />
                                <button
                                    onClick={sendMessage}
                                    disabled={loading || !input.trim()}
                                    style={{
                                        width: '40px', height: '40px', borderRadius: '50%',
                                        background: input.trim() ? 'linear-gradient(135deg, #8b5cf6, #3b82f6)' : 'var(--border)',
                                        color: 'white', display: 'flex', alignItems: 'center',
                                        justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s'
                                    }}
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}

            <style>{`
                @keyframes pulse {
                    0%, 100% { transform: scale(1); box-shadow: 0 4px 24px rgba(139,92,246,0.5); }
                    50% { transform: scale(1.08); box-shadow: 0 4px 30px rgba(139,92,246,0.8); }
                }
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-4px); }
                }
            `}</style>
        </>
    );
}
