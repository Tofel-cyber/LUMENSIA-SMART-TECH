// ===== File: backend/server.js (VERSI BARU DISESUAIKAN UNTUK PROYEK ANDA) =====
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
// **INI BAGIAN YANG SAYA PERBAIKI AGAR SESUAI DENGAN FOLDER ANDA**
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendPath));

// --- ROUTE validation-key.txt ---
app.get('/validation-key.txt', (req, res) => {
    res.sendFile(path.join(frontendPath, 'validation-key.txt'));
});

// --- API ROUTES ---
// Tambahkan route API kamu di sini nanti

// --- FALLBACK ROUTE UNTUK SPA ---
app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// Ekspor app untuk Vercel
module.exports = app;

// Jalankan lokal jika tidak di Vercel
if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server berjalan di port ${PORT}`));
}
