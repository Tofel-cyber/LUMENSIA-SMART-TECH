// ===== File: backend/server.js (VERSI AMAN - KEMBALI KE DASAR) =====

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
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendPath));

// Menyajikan validation-key.txt secara eksplisit
app.get('/validation-key.txt', (req, res) => {
    res.sendFile(path.join(frontendPath, 'validation-key.txt'));
});

// --- FALLBACK ROUTE (HARUS DI PALING AKHIR) ---
// Semua permintaan lain akan diarahkan ke index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// Ekspor aplikasi untuk Vercel
module.exports = app;
