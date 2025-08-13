// ===== File: server.js =====

// ===== File: backend/server.js (Versi Lengkap dan Diperbaiki) =====

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // Diperlukan untuk mengelola path file
require('dotenv').config();

const app = express();

// --- Middleware ---
// Mengizinkan permintaan dari domain lain (penting untuk pengembangan)
app.use(cors());
// Mem-parsing body permintaan JSON
app.use(express.json());

// --- Menyajikan File Statis (HTML, CSS, JS) ---
// Memberi tahu Express untuk menyajikan file dari direktori root proyek.
// path.resolve(__dirname, '..') akan menunjuk ke folder LUMENSIA-SMART-TECH
// dari dalam folder /backend.
app.use(express.static(path.resolve(__dirname, '..')));

// --- Koneksi ke MongoDB ---
const mongoUri = process.env.MONGO_URI;

if (mongoUri) {
  mongoose.connect(mongoUri)
    .then(() => console.log("Berhasil terhubung ke MongoDB."))
    .catch(err => console.error("Gagal terhubung ke MongoDB:", err));
} else {
  console.warn("MONGO_URI tidak ditemukan. Server berjalan tanpa koneksi database.");
}

// --- API Routes ---
// Contoh endpoint API untuk memeriksa apakah server berjalan
app.get('/api/status', (req, res) => {
  res.status(200).json({ 
      status: 'success', 
      message: 'Server is running correctly.' 
  });
});

// --- Menangani permintaan ke halaman lain (misal: privacy.html) ---
// Route ini akan mengirimkan file privacy.html jika URL-nya adalah /privacy
app.get('/privacy', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'privacy.html'));
});

// --- Fallback Route untuk Halaman Utama ---
// Route ini akan mengirimkan index.html untuk semua permintaan GET lain
// yang tidak cocok dengan route di atas (misalnya, halaman utama '/').
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'index.html'));
});


// --- Ekspor Aplikasi untuk Vercel ---
// Vercel akan menggunakan 'app' yang diekspor ini untuk menjalankan server.
module.exports = app;
