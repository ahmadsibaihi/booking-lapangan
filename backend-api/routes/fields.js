const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../db');

router.get('/sync', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:3000/api/fields');
    const fields = response.data;

    for (const field of fields) {
      await db.query(
        `INSERT INTO fields (name, type, location, price_per_hour, description, image_url, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          field.name,
          field.type,
          field.location,
          field.price_per_hour,
          field.description,
          field.image_url
        ]
      );
    }

    res.json({ message: 'Data lapangan berhasil disinkronkan' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal mengambil atau menyimpan data lapangan' });
  }
});

module.exports = router;
