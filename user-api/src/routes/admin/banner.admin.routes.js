// const express = require('express');
// const router = express.Router();
// const bannerController = require('../../controllers/admin/banner.admin.controller');
// const { uploadBanner } = require('../../middlewares/upload.middleware');

// router.post('/', uploadBanner.single('image'), bannerController.createBanner);
// router.get('/', bannerController.getAllBanners);
// router.put('/:id', uploadBanner.single('image'), bannerController.updateBanner);
// router.delete('/:id', bannerController.deleteBanner);

// module.exports = router;
const express = require('express');
const router = express.Router();
const bannerController = require('../../controllers/admin/banner.admin.controller');
const { uploadBanner } = require('../../middlewares/upload.middleware');

router.post('/', uploadBanner, bannerController.createBanner);
router.get('/', bannerController.getAllBanners);
router.put('/:id', uploadBanner, bannerController.updateBanner);
router.delete('/:id', bannerController.deleteBanner);

module.exports = router;