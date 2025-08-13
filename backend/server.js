// ===== File: server.js =====

// ===== File: server.js (Versi Perbaikan) =====

// ===== File: backend/server.js (Versi Baru untuk Vercel) =====
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Koneksi ke MongoDB
const mongoUri = process.env.MONGO_URI;
mongoose.connect(mongoUri)
  .then(() => console.log("Berhasil terhubung ke MongoDB"))
  .catch(err => console.error("Gagal terhubung ke MongoDB:", err));

// Schema dan Model Produk (Sama seperti sebelumnya)
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  imageUrl: { type: String },
  stock: { type: Number, default: 1 },
  tags: [String]
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

// --- ROUTES ---
// Rute utama untuk verifikasi
app.get('/', (req, res) => {
  res.send('Selamat datang di Backend API Lumensia! Server sudah berjalan dan terhubung ke DB.');
});

// Rute untuk mendapatkan semua produk
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data produk', error: error.message });
  }
});

// Rute untuk menambah produk baru
app.post('/api/products', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: 'Gagal menyimpan produk', error: error.message });
  }
});

// --- PENTING: Ekspor aplikasi untuk Vercel ---
module.exports = app;
