const express = require('express');
const router = express.Router();

const authMiddleware = require('../../middlewares/auth.middleware');
const roleMiddleware = require('../../middlewares/role.middleware');

const bannerRoutes = require('./banner.admin.routes');
const categoryRoutes = require('./category.admin.routes');
const offerRoutes = require('./offer.admin.routes');
const productRoutes = require('./product.admin.routes');
const userRoutes = require('./user.admin.routes');
const walletRoutes = require('./wallet.admin.routes');
const emiRoutes = require('./emi.admin.routes');
const kycRoutes = require('./kyc.admin.routes');
const loanRoutes = require('./loan.admin.routes');

// Saare admin routes protected + sirf admin role allow
router.use(authMiddleware, roleMiddleware('admin'));

router.use('/banners', bannerRoutes);
router.use('/categories', categoryRoutes);
router.use('/offers', offerRoutes);
router.use('/products', productRoutes);
router.use('/users', userRoutes);
router.use('/wallet', walletRoutes);
router.use('/emi', emiRoutes);
router.use('/kyc', kycRoutes);
router.use('/loan', loanRoutes)

module.exports = router;