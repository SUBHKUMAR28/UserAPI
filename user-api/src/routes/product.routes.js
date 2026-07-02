const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.use(authMiddleware);

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

module.exports = router;