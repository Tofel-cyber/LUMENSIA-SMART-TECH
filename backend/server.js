// ===== File: server.js =====

// ===== File: server.js (Versi Perbaikan) =====

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// ===== MIDDLEWARE =====
// PENTING: Middleware ini harus didefinisikan SEBELUM routes
app.use(cors());
app.use(express.json()); // <-- Baris ini sangat penting untuk membaca body JSON

// ===== KONEKSI DATABASE =====
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Berhasil terhubung ke MongoDB'))
  .catch((err) => console.error('Gagal terhubung ke MongoDB:', err));

// ===== SCHEMA & MODEL =====
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { 
    type: String, 
    required: true, 
    enum: ['Properti Smart Home', 'Panel Smart Home', 'Jasa Instalasi']
  },
  imageUrl: String,
  stock: { type: Number, default: 1 },
  tags: [String],
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);

// ===== ROUTES (URL ENDPOINTS) =====

// Endpoint dasar untuk testing
app.get('/', (req, res) => {
  res.send('Selamat datang di Backend API Lumensia! Server sudah berjalan dan terhubung ke DB.');
});

// Endpoint untuk melihat SEMUA produk
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data produk', error: error.message });
  }
});

// Endpoint untuk MENAMBAH PRODUK BARU
app.post('/api/products', async (req, res) => {
  try {
    const newProduct = new Product({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      imageUrl: req.body.imageUrl,
      stock: req.body.stock,
      tags: req.body.tags
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);

  } catch (error) {
    res.status(400).json({ message: 'Gagal menyimpan produk baru', error: error.message });
  }
});

// ===== JALANKAN SERVER =====
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}` );
});

