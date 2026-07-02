const express = require('express');
const router = express.Router();
const emiController = require('../controllers/emi.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { payEmiSchema } = require('../validations/emi.validator');

router.use(authMiddleware);

router.get('/list', emiController.getEmiList);
router.get('/:id', emiController.getEmiById);
router.post('/pay', validate(payEmiSchema), emiController.payEmi);

module.exports = router;