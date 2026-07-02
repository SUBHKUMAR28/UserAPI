const express = require('express');
const router = express.Router();
const kycController = require('../../controllers/admin/kyc.admin.controller');

router.get('/', kycController.getAllKyc);
router.get('/:id', kycController.getKycById);
router.put('/:id/status', kycController.updateKycStatus);

module.exports = router;