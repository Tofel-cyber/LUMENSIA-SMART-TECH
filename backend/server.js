// ===== File: backend/server.js (URUTAN DIPERBAIKI) =====

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Menyajikan File Statis (HTML, TXT, CSS, JS) ---
// PENTING: Ini harus dijalankan SEBELUM rute API dan fallback.
// Ini akan secara otomatis menyajikan file seperti index.html dan validation-key.txt.
const projectRoot = path.resolve(__dirname, '..');
app.use(express.static(projectRoot));

// --- Koneksi ke MongoDB ---
const mongoUri = process.env.MONGO_URI;
if (mongoUri) {
    mongoose.connect(mongoUri)
        .then(() => console.log("SUCCESS: Berhasil terhubung ke MongoDB."))
        .catch(err => console.error("ERROR: Gagal terhubung ke MongoDB:", err));
} else {
    console.warn("WARNING: MONGO_URI tidak ditemukan.");
}

// --- API Routes ---
app.get('/api/status', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Server is running correctly.'
    });
});

// --- Fallback Route (HARUS DI PALING AKHIR) ---
// Jika permintaan tidak cocok dengan file statis atau rute API di atas,
// baru kirimkan index.html.
app.get('*', (req, res) => {
    res.sendFile(path.join(projectRoot, 'index.html'));
});

// --- Ekspor Aplikasi untuk Vercel ---
module.exports = app;
