// backend/routes/index.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const permit = require('../middleware/permit');
const fieldCtrl = require('../controllers/fieldController');
const bookingCtrl = require('../controllers/bookingController');
const paymentCtrl = require('../controllers/paymentController');

router.get('/fields', fieldCtrl.list);
router.get('/fields/:id', fieldCtrl.detail);

router.post('/bookings', auth, bookingCtrl.create);
router.get('/bookings/me', auth, bookingCtrl.my);
router.get('/bookings', auth, permit('Admin'), bookingCtrl.all);
router.patch('/bookings/:id/approve', auth, permit('Admin'), bookingCtrl.approve);

router.post('/payments', auth, paymentCtrl.create);

module.exports = router;
