// const express = require('express');
// const router = express.Router();
// const walletController = require('../../controllers/admin/wallet.admin.controller');

// router.get('/', walletController.getAllWallets);
// router.put('/:userId', walletController.updateWallet);

// module.exports = router;
const express = require('express');
const router = express.Router();
const walletController = require('../../controllers/admin/wallet.admin.controller');

router.get('/', walletController.getAllWallets);
router.put('/:userId', walletController.updateWallet);

module.exports = router;