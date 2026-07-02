const express = require('express');
const router = express.Router();
const walletController = require('../controllers/wallet.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.use(authMiddleware);

router.get('/summary', walletController.getWalletSummary);
router.get('/transactions', walletController.getTransactions);

module.exports = router;