// backend/controllers/bookingController.js
const db = require('../db');

function diffHours(date, start, end){
  const s = new Date(`${date}T${start}`), e = new Date(`${date}T${end}`);
  return Math.max(0, (e-s)/3600000);
}

exports.create = (req,res)=>{
  const { field_id, date, start_time, end_time } = req.body;
  if(!field_id||!date||!start_time||!end_time) return res.status(400).json({error:'field_id, date, start_time, end_time wajib'});
  db.query('SELECT id, price_per_hour FROM fields WHERE id=?',[field_id],(e,frows)=>{
    if(e) return res.status(500).json({error:e.message});
    if(!frows.length) return res.status(404).json({error:'Field tidak ditemukan'});
    const overlapSql = `
      SELECT 1 FROM bookings
      WHERE field_id=? AND date=?
        AND NOT (end_time <= ? OR start_time >= ?)
        AND status IN ('pending','confirmed') LIMIT 1`;
    db.query(overlapSql,[field_id,date,start_time,end_time],(e2,orows)=>{
      if(e2) return res.status(500).json({error:e2.message});
      if(orows.length) return res.status(409).json({error:'Slot sudah terisi'});
      const hours = diffHours(date,start_time,end_time);
      const total = Number((hours * Number(frows[0].price_per_hour)).toFixed(2));
      const now = new Date();
      const payload = { user_id:req.user.id, field_id, date, start_time, end_time, total_price:total, status:'pending', payment_status:'unpaid', created_at:now, updated_at:now };
      db.query('INSERT INTO bookings SET ?', payload, (e3, r)=>{
        if(e3) return res.status(500).json({error:e3.message});
        res.status(201).json({ message:'Booking dibuat, silakan bayar', booking:{ id:r.insertId, ...payload }});
      });
    });
  });
};

exports.my = (req,res)=>{
  const sql = `SELECT b.*, f.name AS field_name, f.location, f.image_url
               FROM bookings b JOIN fields f ON f.id=b.field_id
               WHERE b.user_id=? ORDER BY b.created_at DESC`;
  db.query(sql,[req.user.id],(e,rows)=>{ if(e) return res.status(500).json({error:e.message}); res.json(rows); });
};

exports.all = (req,res)=>{
  const sql = `SELECT b.*, u.name AS user_name, f.name AS field_name
               FROM bookings b JOIN users u ON u.id=b.user_id JOIN fields f ON f.id=b.field_id
               ORDER BY b.created_at DESC`;
  db.query(sql,(e,rows)=>{ if(e) return res.status(500).json({error:e.message}); res.json(rows); });
};

exports.approve = (req,res)=>{
  const id = req.params.id, now = new Date();
  db.query(`UPDATE bookings SET status='confirmed', payment_status='paid', updated_at=? WHERE id=?`,[now,id],(e,r)=>{
    if(e) return res.status(500).json({error:e.message});
    if(!r.affectedRows) return res.status(404).json({error:'Booking tidak ditemukan'});
    res.json({message:'Pembayaran di-approve, booking dikonfirmasi'});
  });
};
