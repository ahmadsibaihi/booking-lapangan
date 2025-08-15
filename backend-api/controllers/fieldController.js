const db = require('../db');

exports.getAllFields = (req, res) => {
  const sql = `
    SELECT
      id,
      name        AS nama,
      type        AS jenis,
      location    AS lokasi,
      price_per_hour AS harga,
      description AS deskripsi,
      image_url   AS gambar,
      created_at, updated_at
    FROM fields
    ORDER BY id DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.getFieldById = (req, res) => {
  const sql = `
    SELECT
      id,
      name        AS nama,
      type        AS jenis,
      location    AS lokasi,
      price_per_hour AS harga,
      description AS deskripsi,
      image_url   AS gambar,
      created_at, updated_at
    FROM fields WHERE id=?
  `;
  db.query(sql, [req.params.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!rows.length) return res.status(404).json({ error: 'Lapangan tidak ditemukan' });
    res.json(rows[0]);
  });
};

exports.createField = (req, res) => {
  const { name, type, location, price_per_hour, description, image_url } = req.body;
  const sql = `
    INSERT INTO fields (name, type, location, price_per_hour, description, image_url, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
  `;
  db.query(sql, [name, type, location, price_per_hour, description, image_url], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Lapangan berhasil ditambahkan!', id: result.insertId });
  });
};

exports.updateField = (req, res) => {
  const { id } = req.params;
  const { name, type, location, price_per_hour, description, image_url } = req.body;
  const sql = `
    UPDATE fields
      SET name=?, type=?, location=?, price_per_hour=?, description=?, image_url=?, updated_at=NOW()
    WHERE id=?
  `;
  db.query(sql, [name, type, location, price_per_hour, description, image_url, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Lapangan berhasil diperbarui!' });
  });
};

exports.deleteField = (req, res) => {
  db.query('DELETE FROM fields WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Lapangan berhasil dihapus!' });
  });
};
