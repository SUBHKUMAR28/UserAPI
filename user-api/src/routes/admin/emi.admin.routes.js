
const express = require('express');
const router = express.Router();
const emiController = require('../../controllers/admin/emi.admin.controller');

router.post('/', emiController.createEmi);
router.get('/', emiController.getAllEmis);
router.put('/:id', emiController.updateEmi);
router.delete('/:id', emiController.deleteEmi);

module.exports = router;