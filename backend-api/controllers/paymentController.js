const db = require('../db');
exports.create = (req,res)=>{
  const { booking_id, method='manual', amount, proof_image_url='' } = req.body;
  if(!booking_id || !amount) return res.status(400).json({error:'booking_id & amount wajib'});

  db.query('SELECT * FROM bookings WHERE id=? AND user_id=?',[booking_id, req.user.id],(e,rows)=>{
    if(e) return res.status(500).json({error:e.message});
    if(!rows.length) return res.status(404).json({error:'Booking tidak ditemukan'});
    const now = new Date();
    const payload = { booking_id, method, amount, payment_time:now, proof_image_url, created_at:now, updated_at:now };
    db.query('INSERT INTO payments SET ?', payload, (e2,r)=>{
      if(e2) return res.status(500).json({error:e2.message});
      res.status(201).json({ message:'Pembayaran terkirim, menunggu verifikasi admin', payment:{ id:r.insertId, ...payload }});
    });
  });
};
