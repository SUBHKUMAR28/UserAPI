
// const express = require('express');
// const router = express.Router();
// const productController = require('../../controllers/admin/product.admin.controller');
// const { uploadProduct } = require('../../middlewares/upload.middleware');

// router.post('/', uploadProduct.array('images', 5), productController.createProduct);
// router.get('/', productController.getAllProducts);
// router.put('/:id', uploadProduct.array('images', 5), productController.updateProduct);
// router.delete('/:id', productController.deleteProduct);

// module.exports = router;
const express = require('express');
const router = express.Router();
const productController = require('../../controllers/admin/product.admin.controller');
const { uploadProduct } = require('../../middlewares/upload.middleware');

router.post('/', uploadProduct, productController.createProduct);
router.get('/', productController.getAllProducts);
router.put('/:id', uploadProduct, productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;