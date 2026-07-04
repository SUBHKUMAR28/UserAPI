// src/routes/order.routes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Saare order routes protected hain
router.use(authMiddleware);

router.post('/buy-now', orderController.buyNow);
router.post('/place', orderController.placeOrder);
router.get('/list', orderController.getOrders);
router.get('/:id', orderController.getOrderById);

module.exports = router;