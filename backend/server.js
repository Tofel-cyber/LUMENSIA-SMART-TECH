// ===== File: backend/server.js (VERSI FINAL DAN PALING ANDAL) =====

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs'); // Memuat modul File System
require('dotenv').config();

const app = express();
const projectRoot = path.resolve(__dirname, '..');

// --- Middleware ---
app.use(cors());
app.use(express.json());


// =================================================================
//      PERBAIKAN UTAMA: RUTE KHUSUS UNTUK VERIFIKASI PI
// =================================================================
// Ini akan menangani permintaan ke validation-key.txt SEBELUM hal lain.
app.get('/validation-key.txt', (req, res) => {
    const validationFilePath = path.join(projectRoot, 'validation-key.txt');
    console.log(`Mencoba menyajikan file verifikasi dari: ${validationFilePath}`);
    
    // Kirim file sebagai teks biasa
    res.sendFile(validationFilePath, (err) => {
        if (err) {
            console.error("Gagal mengirim file verifikasi:", err);
            res.status(404).send("File verifikasi tidak ditemukan.");
        } else {
            console.log("Berhasil mengirim file verifikasi.");
        }
    });
});
// =================================================================


// --- Menyajikan File Statis Lainnya (CSS, JS, Gambar) ---
// Ini akan menangani file lain seperti script.js, dll.
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
// Jika tidak ada yang cocok di atas, kirimkan index.html.
app.get('*', (req, res) => {
    res.sendFile(path.join(projectRoot, 'index.html'));
});


// --- Ekspor Aplikasi untuk Vercel ---
module.exports = app;
