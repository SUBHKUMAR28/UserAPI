const express = require('express');
const router = express.Router();
const loanController = require('../../controllers/admin/loan.admin.controller');

router.get('/', loanController.getAllLoans);
router.get('/:id', loanController.getLoanById);
router.put('/:id/approve', loanController.approveLoan);
router.put('/:id/reject', loanController.rejectLoan);
router.put('/:id/disburse', loanController.disburseLoan);

module.exports = router;