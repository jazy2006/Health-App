import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Star, MapPin, Search, Cpu, CheckCircle } from 'lucide-react';

const INITIAL_DOCTORS = [
    {
        id: 1,
        name: 'Dr. Sarah Jenkins',
        spec: 'Cardiologist',
        hospital: 'Metro City Hospital',
        rating: 4.9,
        reviews: 128,
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&q=80',
        slots: ['09:00 AM', '11:00 AM', '02:30 PM']
    },
    {
        id: 2,
        name: 'Dr. Michael Chen',
        spec: 'General Physician',
        hospital: 'Wellness Clinic',
        rating: 4.8,
        reviews: 84,
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=150&q=80',
        slots: ['10:00 AM', '01:00 PM', '04:00 PM']
    },
    {
        id: 3,
        name: 'Dr. Emily Garcia',
        spec: 'Psychiatrist',
        hospital: 'Serenity Mental Health',
        rating: 5.0,
        reviews: 210,
        image: 'https://images.unsplash.com/photo-1594824436951-7f12bc4f30d8?auto=format&fit=crop&w=150&q=80',
        slots: ['08:30 AM', '03:15 PM']
    },
    {
        id: 4,
        name: 'Dr. James Wilson',
        spec: 'Neurologist',
        hospital: 'Central Neuro Institute',
        rating: 4.7,
        reviews: 156,
        image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&q=80',
        slots: ['09:30 AM', '12:00 PM', '03:45 PM']
    },
    {
        id: 5,
        name: 'Dr. Anita Patel',
        spec: 'Dermatologist',
        hospital: 'Skin & Beauty Clinic',
        rating: 4.9,
        reviews: 342,
        image: 'https://images.unsplash.com/photo-1527613426496-228bb8da02a3?auto=format&fit=crop&w=150&q=80',
        slots: ['11:00 AM', '02:00 PM', '05:00 PM']
    },
    {
        id: 6,
        name: 'Dr. Robert Martinez',
        spec: 'Orthopedic Surgeon',
        hospital: 'Joint & Bone Center',
        rating: 4.8,
        reviews: 95,
        image: 'https://images.unsplash.com/photo-1537368910025-702800d4b3a8?auto=format&fit=crop&w=150&q=80',
        slots: ['08:00 AM', '01:30 PM']
    },
    {
        id: 7,
        name: 'Dr. Lisa Thompson',
        spec: 'Pediatrician',
        hospital: 'Happy Kids Clinic',
        rating: 5.0,
        reviews: 412,
        image: 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&w=150&q=80',
        slots: ['10:15 AM', '04:30 PM']
    },
    {
        id: 8,
        name: 'Dr. David Kim',
        spec: 'Endocrinologist',
        hospital: 'City Health Hospital',
        rating: 4.6,
        reviews: 78,
        image: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&w=150&q=80',
        slots: ['09:00 AM', '11:45 AM', '03:00 PM']
    }
];

export default function DoctorBooking() {
    const [doctors, setDoctors] = useState(INITIAL_DOCTORS);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [aiMessage, setAiMessage] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [bookingStatus, setBookingStatus] = useState(null); // 'loading', 'success', 'error'
    const [doctorSearch, setDoctorSearch] = useState('');

    const filteredDoctors = doctors.filter(doc =>
        doc.name.toLowerCase().includes(doctorSearch.toLowerCase()) ||
        doc.spec.toLowerCase().includes(doctorSearch.toLowerCase()) ||
        doc.hospital.toLowerCase().includes(doctorSearch.toLowerCase())
    );

    const handleSuperAI = async () => {
        if (!searchQuery) {
            setAiMessage("Please enter a disease or symptom first!");
            return;
        }

        setAiMessage("Super AI is analyzing for the best specialist...");

        try {
            const res = await fetch(`/api/ai/search?q=${encodeURIComponent(searchQuery)}`);
            const data = await res.json();

            if (data.result) {
                setAiMessage(data.result.message);
                if (data.result.doctor) {
                    const recommendedDoctorMatch = INITIAL_DOCTORS.find(d => d.name === data.result.doctor.doctor);
                    if (recommendedDoctorMatch) {
                        setDoctors([recommendedDoctorMatch]); // Filter list to only show AI recommendation
                    } else {
                        // Mock dynamic loading of doctor
                        setDoctors([{
                            id: 99,
                            name: data.result.doctor.doctor,
                            spec: data.result.doctor.spec,
                            hospital: data.result.doctor.hospital,
                            rating: 5.0,
                            reviews: 99,
                            image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=150&q=80',
                            slots: ['09:00 AM', '12:00 PM']
                        }]);
                    }
                } else {
                    setDoctors(INITIAL_DOCTORS);
                }
            }
        } catch (err) {
            setAiMessage("Super AI is currently resting. Showing all doctors.");
            setDoctors(INITIAL_DOCTORS);
        }
    };

    const resetSearch = () => {
        setSearchQuery('');
        setAiMessage('');
        setDoctors(INITIAL_DOCTORS);
    };

    const handleBookAppointment = async () => {
        if (!selectedSlot || !userEmail) {
            alert("Please select a slot and enter your email.");
            return;
        }

        setBookingStatus('loading');

        try {
            const res = await fetch(`/api/appointments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    doctorName: selectedDoctor.name,
                    slot: selectedSlot,
                    userEmail: userEmail
                })
            });
            const data = await res.json();

            if (data.success) {
                setBookingStatus('success');
            } else {
                setBookingStatus('error');
            }
        } catch (err) {
            console.error(err);
            setBookingStatus('error');
        }
    };

    return (
        <div className="animate-fade-in" style={{ display: 'grid', gap: '2rem' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2>Available Specialists</h2>
                    <p style={{ color: 'var(--text-light)' }}>Find and book an appointment with top doctors.</p>
                </div>

                <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: 'var(--surface)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border)', width: '350px' }}>
                        <Search size={20} color="var(--text-light)" />
                        <input
                            type="text"
                            placeholder="Search by disease or symptom (e.g. Heart)"
                            style={{ border: 'none', background: 'transparent', padding: 0, outline: 'none', flex: 1 }}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && <button onClick={resetSearch} style={{ color: 'var(--text-light)' }}>&times;</button>}
                    </div>

                    <button onClick={handleSuperAI} className="btn-primary" style={{ background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)', alignSelf: 'flex-end', width: '100%', boxShadow: '0 0 10px rgba(139, 92, 246, 0.4)' }}>
                        <Cpu size={18} /> Ask Super AI Suggestion
                    </button>
                </div>
            </div>

            {aiMessage && (
                <div className="card animate-fade-in" style={{ background: 'linear-gradient(wrap, rgba(139, 92, 246, 0.1), transparent)', borderLeft: '4px solid #8b5cf6' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ background: 'rgba(139, 92, 246, 0.2)', padding: '0.75rem', borderRadius: '50%', color: '#8b5cf6' }}>
                            <Cpu size={24} />
                        </div>
                        <div>
                            <h4 style={{ color: '#8b5cf6' }}>Super AI Insights</h4>
                            <p style={{ fontSize: '0.875rem' }}>{aiMessage}</p>
                        </div>
                    </div>
                </div>
            )}

            <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center', background: 'var(--surface)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border)', width: '100%', maxWidth: '400px' }}>
                <Search size={20} color="var(--text-light)" />
                <input
                    type="text"
                    placeholder="Search doctors by name, specialty, or hospital..."
                    style={{ border: 'none', background: 'transparent', padding: 0, outline: 'none', flex: 1 }}
                    value={doctorSearch}
                    onChange={(e) => setDoctorSearch(e.target.value)}
                />
                {doctorSearch && <button onClick={() => setDoctorSearch('')} style={{ color: 'var(--text-light)' }}>&times;</button>}
            </div>

            <div className="grid grid-cols-3">
                {filteredDoctors.map((doc) => (
                    <div key={doc.id} className="card animate-fade-in" style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                            <img src={doc.image} alt={doc.name} style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-lg)', objectFit: 'cover' }} />
                            <div>
                                <h3 style={{ fontSize: '1.25rem' }}>{doc.name}</h3>
                                <p style={{ color: 'var(--primary)', fontWeight: 500, fontSize: '0.875rem' }}>{doc.spec}</p>
                                <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center', color: '#f59e0b', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                                    <Star size={14} fill="currentColor" /> {doc.rating} <span style={{ color: 'var(--text-light)' }}>({doc.reviews})</span>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', flex: 1 }}>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', color: 'var(--text-light)', fontSize: '0.875rem' }}>
                                <MapPin size={16} /> {doc.hospital}
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', color: 'var(--text-light)', fontSize: '0.875rem' }}>
                                <CalendarIcon size={16} /> Available Today
                            </div>
                        </div>

                        <button
                            className="btn-primary"
                            style={{ width: '100%' }}
                            onClick={() => { setSelectedDoctor(doc); setBookingStatus(null); setSelectedSlot(null); }}
                        >
                            Select & Book
                        </button>
                    </div>
                ))}
                {filteredDoctors.length === 0 && (
                    <p style={{ gridColumn: 'span 3', textAlign: 'center', color: 'var(--text-light)' }}>No doctors found matching your search.</p>
                )}
            </div>

            {selectedDoctor && (
                <div className="card glass-panel animate-fade-in" style={{ position: 'fixed', bottom: '2rem', right: '2rem', width: '400px', zIndex: 50, background: 'rgba(255,255,255,0.95)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3>Book Appointment</h3>
                        <button onClick={() => setSelectedDoctor(null)} style={{ background: 'rgba(244, 63, 94, 0.1)', color: 'var(--accent)', width: '30px', height: '30px', borderRadius: '50%' }}>&times;</button>
                    </div>

                    {bookingStatus === 'success' ? (
                        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                            <CheckCircle size={48} color="var(--secondary)" style={{ margin: '0 auto 1rem' }} />
                            <h4 style={{ marginBottom: '0.5rem', color: 'var(--secondary)' }}>Booking Confirmed!</h4>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>An email confirmation has been sent to {userEmail}.</p>
                            <button onClick={() => setSelectedDoctor(null)} className="btn-secondary" style={{ marginTop: '1.5rem' }}>Close</button>
                        </div>
                    ) : (
                        <>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                                <img src={selectedDoctor.image} alt="" style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} />
                                <div>
                                    <p style={{ fontWeight: 600 }}>{selectedDoctor.name}</p>
                                    <p style={{ color: 'var(--primary)', fontSize: '0.875rem' }}>{selectedDoctor.spec}</p>
                                </div>
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Target Email for Appointment Details</label>
                                <input
                                    type="email"
                                    placeholder="user@example.com"
                                    value={userEmail}
                                    onChange={(e) => setUserEmail(e.target.value)}
                                    style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
                                />
                            </div>

                            <p style={{ fontWeight: 500, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Clock size={16} /> Select Time Slot Today
                            </p>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                                {selectedDoctor.slots.map(slot => (
                                    <button
                                        key={slot}
                                        onClick={() => setSelectedSlot(slot)}
                                        style={{
                                            padding: '0.5rem 1rem',
                                            borderRadius: 'var(--radius-full)',
                                            border: `1px solid ${selectedSlot === slot ? 'var(--primary)' : 'var(--border)'}`,
                                            background: selectedSlot === slot ? 'var(--primary)' : 'transparent',
                                            color: selectedSlot === slot ? 'white' : 'var(--text)'
                                        }}
                                    >
                                        {slot}
                                    </button>
                                ))}
                            </div>

                            <button
                                className="btn-primary"
                                style={{ width: '100%', background: bookingStatus === 'loading' ? 'var(--text-light)' : undefined }}
                                onClick={handleBookAppointment}
                                disabled={bookingStatus === 'loading'}
                            >
                                {bookingStatus === 'loading' ? 'Processing...' : 'Confirm Appointment (Sends Email)'}
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
