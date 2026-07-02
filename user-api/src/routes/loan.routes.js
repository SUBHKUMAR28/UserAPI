const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loan.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { applyLoanSchema } = require('../validations/loan.validator');

router.use(authMiddleware);

router.post('/apply', validate(applyLoanSchema), loanController.applyLoan);
router.get('/list', loanController.getLoanList);
router.get('/:id', loanController.getLoanById);

module.exports = router;