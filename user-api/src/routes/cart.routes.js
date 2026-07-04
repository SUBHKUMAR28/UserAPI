// src/routes/cart.routes.js
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Saare cart routes protected hain - bina login ke access nahi
router.use(authMiddleware);

router.get('/', cartController.getCart);
router.post('/add', cartController.addToCart);
// router.put('/update', cartController.updateCart);
router.delete('/remove/:productId', cartController.removeFromCart);
router.delete('/clear', cartController.clearCart);

module.exports = router;