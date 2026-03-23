require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { createClient } = require('@supabase/supabase-js');
const { GoogleGenAI } = require('@google/genai');

const app = express();
const path = require('path');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the React app dist folder
app.use(express.static(path.join(__dirname, '../dist')));


// Request Logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Initialize Supabase Client if env vars exist
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
let supabase = null;

if (supabaseUrl && supabaseKey && supabaseUrl.startsWith('http')) {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log("Supabase Client Initialized");
} else {
    console.log("Supabase credentials missing or invalid. Using mocked memory storage for History.");
}

// In-memory fallback
let fallbackHistory = [
    { id: 1, action: "Logged in to Health Bridge", created_at: new Date().toISOString() },
    { id: 2, action: "Checked Dashboard Vitals", created_at: new Date().toISOString() }
];

// Helper to log history to Supabase (or memory)
const recordActivity = async (action) => {
    if (supabase) {
        try {
            const { error } = await supabase
                .from('activity_history')
                .insert([{ action: action }]);
            if (error) console.error("Supabase insert error:", error);
        } catch (err) {
            console.error(err);
        }
    } else {
        fallbackHistory.push({ id: Date.now(), action, created_at: new Date().toISOString() });
    }
};

// 1. Super AI Search (Using Google Gemini API via SDK)
app.get('/api/ai/search', async (req, res) => {
    const disease = req.query.q;
    if (!disease) {
        return res.status(400).json({ error: 'Query required' });
    }

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
    console.log(`[AI Search] Query: "${disease}" | API Key present: ${!!(apiKey && apiKey !== 'YOUR_GEMINI_API_KEY_HERE')}`);

    if (apiKey && apiKey !== 'YOUR_GEMINI_API_KEY_HERE') {
        const modelsToTry = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro', 'gemini-pro'];
        for (const modelName of modelsToTry) {
            try {
                const ai = new GoogleGenAI({ apiKey });
                const prompt = `A patient reported these symptoms or condition: "${disease}". 
Respond with a short, compassionate 1-2 sentence assessment.
Then recommend exactly ONE specialty from this list: Cardiologist, General Physician, Psychiatrist, Neurologist, Dermatologist, Orthopedic Surgeon, Pediatrician, Endocrinologist.
Return ONLY valid JSON like this (no markdown, no extra text):
{"message": "your compassionate assessment here", "specialty": "Specialty Name"}`;

                console.log(`[Gemini] Trying model: ${modelName}`);
                const response = await ai.models.generateContent({
                    model: modelName,
                    contents: prompt,
                });

                const rawText = response.text.trim();
                console.log(`[Gemini] Success with ${modelName}:`, rawText.substring(0, 100));

                const cleanText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
                const resultObj = JSON.parse(cleanText);

                const aiSpec = (resultObj.specialty || 'General Physician').trim();
                const aiMessage = resultObj.message || 'We analyzed your symptoms.';
                const bestMatch = fallbackDB.find(d => d.spec.toLowerCase() === aiSpec.toLowerCase()) || fallbackDB[1];

                await recordActivity(`Used Gemini AI (${modelName}) for: ${disease}`);

                return res.json({
                    result: {
                        success: true,
                        message: `🤖 Nova AI: ${aiMessage}`,
                        doctor: bestMatch
                    }
                });
            } catch (err) {
                const errBody = (() => { try { return JSON.parse(err.message); } catch (_) { return null; } })();
                const code = errBody?.error?.code;
                console.warn(`[Gemini] Model ${modelName} failed with code ${code}. Trying next...`);
                if (code !== 429 && code !== 404) break; // Don't retry for other errors
            }
        }
        console.error('[Gemini] All models exhausted or failed.');
    }

    // Keyword Fallback
    console.log('[AI Search] Falling back to keyword matching.');
    await recordActivity(`Used Keyword AI Search for: ${disease}`);
    const diseaseLower = disease.toLowerCase();
    let bestMatch = fallbackDB[1];
    if (diseaseLower.includes('heart') || diseaseLower.includes('cardio') || diseaseLower.includes('chest')) bestMatch = fallbackDB[0];
    else if (diseaseLower.includes('stress') || diseaseLower.includes('anxiety') || diseaseLower.includes('depress') || diseaseLower.includes('mental')) bestMatch = fallbackDB[2];
    else if (diseaseLower.includes('brain') || diseaseLower.includes('nerve') || diseaseLower.includes('headache') || diseaseLower.includes('migraine')) bestMatch = fallbackDB[3];
    else if (diseaseLower.includes('skin') || diseaseLower.includes('rash') || diseaseLower.includes('acne')) bestMatch = fallbackDB[4];
    else if (diseaseLower.includes('bone') || diseaseLower.includes('joint') || diseaseLower.includes('back') || diseaseLower.includes('knee')) bestMatch = fallbackDB[5];
    else if (diseaseLower.includes('child') || diseaseLower.includes('baby') || diseaseLower.includes('kid')) bestMatch = fallbackDB[6];
    else if (diseaseLower.includes('diabetes') || diseaseLower.includes('thyroid') || diseaseLower.includes('hormone')) bestMatch = fallbackDB[7];

    res.json({
        result: {
            success: true,
            message: `Based on "${disease}", we recommend consulting this specialist.`,
            doctor: bestMatch
        }
    });
});

// 2. Gemini Conversational Chat Endpoint
app.post('/api/ai/chat', async (req, res) => {
    const { message, history = [] } = req.body;
    if (!message) return res.status(400).json({ error: 'Message required' });

    const apiKey = process.env.GEMINI_API_KEY;
    const modelsToTry = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro'];

    const systemPrompt = `You are Bridge AI, a professional and compassionate healthcare assistant for Health Bridge.
Your goal is to provide intelligent answers based on 4 main health categories:
1. 🩺 **Symptom Assessment**: If the user reports pain or symptoms, provide a compassionate assessment of potential causes without diagnosing. Recommend a specific medical specialist (Cardiologist, Neurologist, etc.) if applicable.
2. 🥗 **Wellness & Lifestyle**: For questions about fitness, diet, or overall health, give evidence-based tips for a better life.
3. 🧘 **Mental Wellbeing**: For stress, anxiety, or burnout, provide immediate relief techniques (like breathing exercises) and encourage seeking professional counseling if needed.
4. 💊 **General Health Info**: For information on diseases or biological topics, explain them in clear, simple terms.

**Crucial Guidelines:**
- ALWAYS maintain a warm, helping tone. 💙
- NEVER give specific drug names or dosages (prescriptions).
- NEVER state a definitive diagnosis (use phrases like "it could be related to..." instead).
- IF A QUERY SEEMS URGENT (chest pain, intense breathing difficulity), tell the user to seek emergency medical help immediately.
- Use bullet points for readability when giving tips.
- Keep responses within 3-4 concise sentences.`;

    const conversationContext = history.slice(-6).map(m =>
        `${m.role === 'user' ? 'Patient' : 'Nova AI'}: ${m.text}`
    ).join('\n');

    const fullPrompt = `${systemPrompt}\n\nConversation so far:\n${conversationContext}\n\nPatient: ${message}\n\nNova AI:`;

    if (apiKey && apiKey !== 'YOUR_GEMINI_API_KEY_HERE') {
        for (const modelName of modelsToTry) {
            try {
                const ai = new GoogleGenAI({ apiKey });
                const response = await ai.models.generateContent({
                    model: modelName,
                    contents: fullPrompt,
                });
                const reply = response.text.trim();
                await recordActivity(`Used Nova AI Chat: "${message.substring(0, 40)}..."`);
                console.log(`[Chat] Success with ${modelName}`);
                return res.json({ reply });
            } catch (err) {
                const code = (() => { try { return JSON.parse(err.message)?.error?.code; } catch (_) { return null; } })();
                console.warn(`[Chat] Model ${modelName} failed (${code}). Trying next...`);
                if (code !== 429 && code !== 404) break;
            }
        }
    }

    // Smart keyword fallback responses
    const lowerMsg = message.toLowerCase();
    let fallback = "I'm here to help with your health questions! While I couldn't connect to the AI right now, I recommend speaking to a doctor for personalized advice. 😊";
    if (lowerMsg.includes('stress') || lowerMsg.includes('anxious')) fallback = "It sounds like you're feeling stressed. 💙 Try taking 5 deep breaths right now. Regular exercise, proper sleep, and limiting caffeine can also help significantly. If it persists, consider speaking with a mental health professional.";
    else if (lowerMsg.includes('fever') || lowerMsg.includes('temperature')) fallback = "A fever is often your body fighting an infection. 🌡️ Make sure to stay hydrated, rest well, and take paracetamol if needed. If it's above 39°C (102°F) or lasts more than 3 days, please see a doctor.";
    else if (lowerMsg.includes('headache')) fallback = "Headaches can have many causes — dehydration, stress, or eye strain. 💧 Try drinking water, resting in a dark room, and a gentle head massage. Persistent or severe headaches should be evaluated by a neurologist.";
    else if (lowerMsg.includes('sleep') || lowerMsg.includes('insomnia')) fallback = "Good sleep is essential for health! 🌙 Try maintaining a consistent sleep schedule, avoid screens 1 hour before bed, and keep your room cool and dark. Chamomile tea or light meditation can also help.";
    else if (lowerMsg.includes('diet') || lowerMsg.includes('food') || lowerMsg.includes('nutrition')) fallback = "A balanced diet is the foundation of good health! 🥗 Aim for plenty of vegetables, lean proteins, whole grains, and healthy fats. Limit processed foods and sugary drinks. Staying hydrated with 8 glasses of water daily is key!";

    res.json({ reply: fallback });
});


app.get('/api/history', async (req, res) => {
    if (supabase) {
        const { data, error } = await supabase
            .from('activity_history')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Supabase fetch error:", error);
            return res.status(500).json({ error: "Failed to fetch history from Supabase" });
        }

        // Map created_at to date so frontend formats nicely
        const cleanData = data.map(record => ({
            id: record.id,
            action: record.action,
            date: record.created_at
        }));

        res.json({ history: cleanData });
    } else {
        // Fallback mapping
        const cleanFallback = fallbackHistory.map(record => ({
            id: record.id,
            action: record.action,
            date: record.created_at
        })).reverse();

        res.json({ history: cleanFallback });
    }
});

// Add custom history activity
app.post('/api/history', async (req, res) => {
    const { action } = req.body;
    if (!action) return res.status(400).json({ error: "Action is required" });
    await recordActivity(action);
    res.json({ success: true });
});

// 3. Book Appointment and Send Email
app.post('/api/appointments', async (req, res) => {
    const { doctorName, slot, userEmail, userPhone } = req.body;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    await recordActivity(`Booked appointment with ${doctorName} at ${slot}`);

    try {
        let transporter;

        // Use real credentials if provided, otherwise fallback to test account
        if (smtpUser && smtpUser !== 'your-email@gmail.com' && smtpPass) {
            transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true, // true for 465, false for 587
                auth: {
                    user: smtpUser,
                    pass: smtpPass,
                },
            });
            console.log(`[Email] Using Real SMTP (smtp.gmail.com) for ${smtpUser}`);
        } else {
            console.log("⚠️  REAL SMTP credentials NOT CONFIGURED in .env. Falling back to Test Account.");
            let testAccount = await nodemailer.createTestAccount();
            transporter = nodemailer.createTransport({
                host: "smtp.ethereal.email", port: 587, secure: false,
                auth: { user: testAccount.user, pass: testAccount.pass },
            });
        }

        let info = await transporter.sendMail({
            from: `"Health Bridge Care" <${smtpUser || 'noreply@healthbridge.com'}>`,
            to: userEmail || "user@example.com",
            subject: `Care Confirmed: Appointment with Dr. ${doctorName}`,
            text: `Your Health Bridge appointment with ${doctorName} is confirmed for ${slot}. Contact: ${userPhone || 'N/A'}`,
            html: `
                <div style="font-family: sans-serif; color: #333; max-width: 600px; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h1 style="color: #8b5cf6;">Health Bridge</h1>
                    </div>
                    <h2>Appointment Confirmed! ✅</h2>
                    <p>Hello,</p>
                    <p>Your Health Bridge appointment has been successfully scheduled. Here are the details:</p>
                    <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 5px 0;"><b>Doctor:</b> Dr. ${doctorName}</p>
                        <p style="margin: 5px 0;"><b>Time:</b> ${slot}</p>
                        <p style="margin: 5px 0;"><b>Reference:</b> HB-${Math.floor(Math.random() * 90000) + 10000}</p>
                    </div>
                    <p style="color: #666; font-size: 0.9em;">If you need to reschedule, please visit your dashboard or contact support.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="text-align: center; color: #999; font-size: 0.8em;">Health Bridge Platform &bull; Delivering care anytime, anywhere.</p>
                </div>
            `,
        });

        res.json({
            success: true,
            message: `Appointment confirmed! Email sent to ${userEmail || 'registered address'}.`,
            preview: nodemailer.getTestMessageUrl(info) || null
        });

    } catch (err) {
        console.error("Email system failed:", err);
        res.status(500).json({ error: "Booking saved, but could not send email message." });
    }
});

// 4. Send Family Invitation Email
app.post('/api/invite', async (req, res) => {
    const { email } = req.body;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!email) return res.status(400).json({ error: 'Email is required' });

    try {
        let transporter;
        if (smtpUser && smtpUser !== 'your-email@gmail.com' && smtpPass) {
            transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: { user: smtpUser, pass: smtpPass },
            });
            console.log(`[Email-Invite] Using REAL SMTP (smtp.gmail.com) for ${smtpUser}`);
        } else {
            console.log("⚠️  REAL SMTP credentials NOT CONFIGURED for Invites. Using Test Account.");
            let testAccount = await nodemailer.createTestAccount();
            transporter = nodemailer.createTransport({
                host: "smtp.ethereal.email", port: 587, secure: false,
                auth: { user: testAccount.user, pass: testAccount.pass },
            });
        }

        const origin = req.headers.origin || `https://${req.headers.host}`;
        const inviteLink = `${origin}/share/johndoe-xyz89`;

        await transporter.sendMail({
            from: `"Health Bridge" <${smtpUser || 'noreply@healthbridge.com'}>`,
            to: email,
            subject: "Invitation to Join John Doe's Care Circle",
            text: `You've been invited to view John Doe's health summary on Health Bridge. View it here: ${inviteLink}`,
            html: `
                <div style="font-family: sans-serif; color: #333; max-width: 600px; padding: 20px; border: 1px solid #eee; border-radius: 12px;">
                    <h1 style="color: #8b5cf6; text-align: center;">Health Bridge</h1>
                    <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center;">
                        <h2 style="margin-top: 0;">Family Invitation 🤝</h2>
                        <p><b>John Doe</b> has invited you to join their private health care circle.</p>
                        <p style="color: #666;">By joining, you can stay updated on their vitals, activity levels, and emergency alerts in real-time.</p>
                        <a href="${inviteLink}" style="display: inline-block; padding: 12px 24px; background: #8b5cf6; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 10px;">View Health Dashboard</a>
                    </div>
                    <p style="font-size: 0.8em; color: #999; margin-top: 20px; text-align: center;">This is a secure invitation. If you weren't expecting this, you can safely ignore this email.</p>
                </div>
            `,
        });

        await recordActivity(`Sent family invitation to ${email}`);
        res.json({ success: true, message: 'Invitation sent!' });

    } catch (err) {
        console.error("Invite email failed:", err);
        res.status(500).json({ error: "Failed to send invitation." });
    }
});

const PORT = process.env.PORT || 7860;
// Health Check
app.get('/health', (req, res) => res.json({ status: 'Health Bridge Online' }));


// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

if (require.main === module) {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`[Health Bridge] Backend READY at http://0.0.0.0:${PORT}`);
    });
}

module.exports = app;
