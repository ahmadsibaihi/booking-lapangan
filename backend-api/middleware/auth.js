const jwt = require('jsonwebtoken');
module.exports = (req,res,next)=>{
  const h = req.headers.authorization||'';
  const t = h.startsWith('Bearer ') ? h.slice(7) : null;
  if(!t) return res.status(401).json({error:'No token'});
  try { req.user = jwt.verify(t, process.env.JWT_SECRET || 'SECRET_KEY_JAY'); next(); }
  catch { return res.status(401).json({error:'Invalid token'}) }
};
