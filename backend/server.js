// ===== File: backend/server.js (VERSI AWAL YANG PALING STABIL) =====
const express = require('express');
const path = require('path');

const app = express();

// Sajikan semua file dari folder 'frontend'
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendPath));

// Jika ada permintaan yang tidak cocok, kirim index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// Ekspor aplikasi untuk Vercel
module.exports = app;
