// ===== File: backend/server.js (VERSI FINAL DIPERBAIKI) =====

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// --- KONEKSI DATABASE ---
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI)
    .then(() => console.log("SUCCESS: Berhasil terhubung ke MongoDB."))
    .catch(err => console.error("ERROR: Gagal terhubung ke MongoDB:", err));

// --- PENYAJIAN FILE STATIS (FRONTEND) ---
// Ini adalah bagian yang penting. Kita definisikan dulu di mana folder frontend berada.
const frontendPath = path.join(__dirname, '..', 'frontend');

// Menyajikan file statis dari folder 'frontend'
app.use(express.static(frontendPath));

// Menyajikan validation-key.txt secara eksplisit
app.get('/validation-key.txt', (req, res) => {
    res.sendFile(path.join(frontendPath, 'validation-key.txt'));
});

// --- LOGIKA API BACKEND ---
app.post('/api/approve-payment', async (req, res) => {
    const { paymentId } = req.body;
    const PI_API_KEY = process.env.PI_API_KEY;

    if (!paymentId) {
        return res.status(400).json({ message: "Payment ID diperlukan." });
    }
    if (!PI_API_KEY) {
        return res.status(500).json({ message: "API Key tidak dikonfigurasi di server." });
    }

    console.log(`Mencoba menyetujui pembayaran: ${paymentId}`);

    try {
        const piServerResponse = await fetch(`https://api.pi.network/v2/payments/${paymentId}/approve`, {
            method: 'POST',
            headers: {
                'Authorization': `Key ${PI_API_KEY}`
            }
        } );
        const data = await piServerResponse.json();
        if (piServerResponse.ok) {
            console.log("Persetujuan berhasil:", data);
            res.status(200).json({ success: true, data });
        } else {
            console.error("Persetujuan gagal:", data);
            res.status(piServerResponse.status).json({ success: false, message: data.message || "Gagal menyetujui pembayaran di server Pi." });
        }
    } catch (error) {
        console.error("Error internal saat menghubungi server Pi:", error);
        res.status(500).json({ success: false, message: "Error internal server." });
    }
});

// --- FALLBACK ROUTE (HARUS DI PALING AKHIR) ---
// Semua permintaan lain akan diarahkan ke index.html
// **INI BAGIAN YANG DIPERBAIKI**
app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// Ekspor aplikasi untuk Vercel
module.exports = app;
