require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { createClient } = require('@supabase/supabase-js');
const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Static React build
const distPath = path.join(__dirname, '../dist');

if (fs.existsSync(distPath)) {
    console.log(`[Server] ✅ dist folder found`);
} else {
    console.error(`[Server] ❌ dist folder missing`);
}

app.use(express.static(distPath));

// Supabase setup
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

let supabase = null;

if (supabaseUrl && supabaseKey && supabaseUrl.startsWith('http')) {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log("✅ Supabase Connected");
} else {
    console.log("⚠️ Using local memory (no Supabase)");
}

// Fallback history
let fallbackHistory = [];

// Record activity
const recordActivity = async (action) => {
    if (supabase) {
        await supabase.from('activity_history').insert([{ action }]);
    } else {
        fallbackHistory.push({
            id: Date.now(),
            action,
            created_at: new Date().toISOString()
        });
    }
};


// ======================
// 🔹 AI SEARCH
// ======================
app.get('/api/ai/search', async (req, res) => {
    const disease = req.query.q;
    if (!disease) return res.status(400).json({ error: 'Query required' });

    const fallbackDB = [
        { doctor: 'Dr. Sarah Jenkins', spec: 'Cardiologist', hospital: 'Metro City Hospital' },
        { doctor: 'Dr. Michael Chen', spec: 'General Physician', hospital: 'Wellness Clinic' },
        { doctor: 'Dr. Emily Garcia', spec: 'Psychiatrist', hospital: 'Serenity Mental Health' },
        { doctor: 'Dr. James Wilson', spec: 'Neurologist', hospital: 'Central Neuro Institute' },
        { doctor: 'Dr. Anita Patel', spec: 'Dermatologist', hospital: 'Skin & Beauty Clinic' },
        { doctor: 'Dr. Robert Martinez', spec: 'Orthopedic Surgeon', hospital: 'Joint & Bone Center' },
        { doctor: 'Dr. Lisa Thompson', spec: 'Pediatrician', hospital: 'Happy Kids Clinic' },
        { doctor: 'Dr. David Kim', spec: 'Endocrinologist', hospital: 'City Health Hospital' }
    ];

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
        try {
            const ai = new GoogleGenAI({ apiKey });

            const prompt = `User condition: "${disease}"
Return JSON:
{"message":"short reply","specialty":"Doctor type"}`;

            const response = await ai.models.generateContent({
                model: "gemini-1.5-flash",
                contents: prompt
            });

            const clean = response.text.replace(/```/g, '').trim();
            const data = JSON.parse(clean);

            const doctor = fallbackDB.find(d =>
                d.spec.toLowerCase() === data.specialty.toLowerCase()
            ) || fallbackDB[1];

            await recordActivity(`AI Search: ${disease}`);

            return res.json({
                result: {
                    message: data.message,
                    doctor
                }
            });

        } catch (err) {
            console.log("AI failed, fallback used");
        }
    }

    await recordActivity(`Fallback Search: ${disease}`);

    res.json({
        result: {
            message: "Basic recommendation provided.",
            doctor: fallbackDB[1]
        }
    });
});


// ======================
// 🔹 CHAT
// ======================
app.post('/api/ai/chat', async (req, res) => {
    const { message } = req.body;

    if (!message) return res.status(400).json({ error: 'Message required' });

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
        try {
            const ai = new GoogleGenAI({ apiKey });

            const response = await ai.models.generateContent({
                model: "gemini-1.5-flash",
                contents: message
            });

            await recordActivity(`Chat: ${message}`);

            return res.json({ reply: response.text });

        } catch (err) {
            console.log("Chat AI failed");
        }
    }

    res.json({
        reply: "I'm here to help. Please consult a doctor for serious concerns."
    });
});


// ======================
// 🔹 HISTORY
// ======================
app.get('/api/history', async (req, res) => {
    if (supabase) {
        const { data } = await supabase
            .from('activity_history')
            .select('*')
            .order('created_at', { ascending: false });

        const formatted = (data || []).map(r => ({
            id: r.id,
            action: r.action,
            date: r.created_at
        }));
        return res.json({ history: formatted });
    }

    const cleanFallback = fallbackHistory.map(r => ({
        id: r.id,
        action: r.action,
        date: r.created_at
    })).reverse();

    res.json({ history: cleanFallback });
});


// ======================
// 🔹 APPOINTMENT EMAIL
// ======================
app.post('/api/appointments', async (req, res) => {
    const { doctorName, slot, userEmail } = req.body;

    try {
        let transporter;

        if (process.env.SMTP_USER && process.env.SMTP_PASS) {
            transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS
                }
            });
        } else {
            const testAccount = await nodemailer.createTestAccount();
            transporter = nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                auth: testAccount
            });
        }

        const info = await transporter.sendMail({
            from: '"Health Bridge" <noreply@hb.com>',
            to: userEmail,
            subject: "Appointment Confirmed",
            text: `Doctor: ${doctorName}, Time: ${slot}`
        });

        await recordActivity(`Booked ${doctorName}`);

        res.json({
            success: true,
            preview: nodemailer.getTestMessageUrl(info)
        });

    } catch (err) {
        res.status(500).json({ error: "Email failed" });
    }
});


// ======================
// 🔹 HEALTH CHECK
// ======================
app.get('/health', (req, res) => {
    res.json({ status: 'OK' });
});


// ======================
// 🔹 FAMILY INVITE
// ======================
app.post('/api/invite', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });

    try {
        let transporter;
        if (process.env.SMTP_USER && process.env.SMTP_PASS) {
            transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
            });
        } else {
            const testAccount = await nodemailer.createTestAccount();
            transporter = nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                auth: testAccount
            });
        }

        const origin = req.headers.origin || `https://${req.headers.host}`;
        const inviteLink = `${origin}/share/johndoe-xyz89`;

        await transporter.sendMail({
            from: '"Health Bridge" <noreply@hb.com>',
            to: email,
            subject: "Invitation to Join Care Circle",
            html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 12px; max-width: 500px;">
                    <h2 style="color: #8b5cf6;">Health Bridge Invitation ✨</h2>
                    <p>You have been invited to join a health care circle on Health Bridge.</p>
                    <p>This allows you to stay updated with vitals and care records in real-time.</p>
                    <a href="${inviteLink}" style="display: inline-block; padding: 12px 24px; background: #8b5cf6; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">View Health Dashboard</a>
                    <p style="font-size: 0.8em; color: #999; margin-top: 20px;">If you weren't expecting this, you can safely ignore this email.</p>
                </div>
            `
        });

        await recordActivity(`Sent invite to ${email}`);
        res.json({ success: true, message: 'Invitation sent!' });

    } catch (err) {
        console.error("Invite failed:", err);
        res.status(500).json({ error: "Failed to send invitation" });
    }
});


// ======================
// ✅ FIXED CATCH-ALL (IMPORTANT)
// ======================
app.use((req, res) => {
    const indexPath = path.join(__dirname, '../dist/index.html');

    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send("Frontend not built");
    }
});


// ======================
// 🚀 START SERVER
// ======================
const PORT = process.env.PORT || 7860;

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});