const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register user baru
exports.registerUser = async (req, res) => {
  const { name, email, password, photo_url } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, dan password wajib diisi.' });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length > 0) {
      return res.status(400).json({ error: 'Email sudah terdaftar.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const now = new Date();

    const insertQuery = `
      INSERT INTO users (name, email, photo_url, password, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
      insertQuery,
      [name, email, photo_url || '', hashedPassword, now, now],
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        db.query('SELECT id, name, email, photo_url FROM users WHERE id = ?', [result.insertId], (err, userResults) => {
          if (err) return res.status(500).json({ error: err.message });

          res.status(201).json({ message: 'Registrasi berhasil', user: userResults[0] });
        });
      }
    );
  });
};

exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email dan password wajib diisi.' });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(401).json({ error: 'User tidak ditemukan.' });

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Password salah.' });

    delete user.password;

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role }, 
      'SECRET_KEY_JAY', // ganti pakai env
      { expiresIn: '7d' }
    );

    res.json({ 
      message: 'Login berhasil',
      user,
      token
    });
  });
};