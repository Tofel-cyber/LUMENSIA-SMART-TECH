// ===== File: server.js =====

// ===== File: backend/server.js (Versi Debug) =====

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

console.log("--- Serverless function starting ---");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// --- Menyajikan File Statis ---
// Membuat path absolut ke direktori root proyek
const projectRoot = path.resolve(__dirname, '..');
console.log(`Project root directory is: ${projectRoot}`);
console.log("Attempting to serve static files from this directory.");

// Menggunakan direktori root untuk menyajikan file statis
app.use(express.static(projectRoot));

// --- Koneksi ke MongoDB ---
const mongoUri = process.env.MONGO_URI;
if (mongoUri) {
    console.log("MONGO_URI found. Attempting to connect...");
    mongoose.connect(mongoUri)
        .then(() => console.log("SUCCESS: Berhasil terhubung ke MongoDB."))
        .catch(err => console.error("ERROR: Gagal terhubung ke MongoDB:", err));
} else {
    console.warn("WARNING: MONGO_URI tidak ditemukan.");
}

// --- API Routes ---
app.get('/api/status', (req, res) => {
    console.log("HIT: /api/status endpoint was called.");
    res.status(200).json({
        status: 'success',
        message: 'Server is running correctly.'
    });
});

// --- Fallback untuk Single Page Application (SPA) ---
// Mengirim index.html untuk semua rute yang tidak cocok
app.get('*', (req, res) => {
    console.log(`HIT: Fallback route for path: ${req.path}. Sending index.html.`);
    res.sendFile(path.join(projectRoot, 'index.html'));
});

// Ekspor aplikasi untuk Vercel
console.log("--- Serverless function configured. Exporting app. ---");
module.exports = app;
