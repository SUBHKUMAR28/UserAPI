// const express = require('express');
// const router = express.Router();
// const kycController = require('../controllers/userkyc.controller');
// const authMiddleware = require('../middlewares/auth.middleware');
// const { uploadKyc } = require('../middlewares/upload.middleware');

// router.use(authMiddleware);

// router.post(
//   '/submit',
//   uploadKyc.fields([
//     { name: 'pan_image', maxCount: 1 },
//     { name: 'aadhaar_front_image', maxCount: 1 },
//     { name: 'aadhaar_back_image', maxCount: 1 },
//     { name: 'selfie_image', maxCount: 1 },
//   ]),
//   kycController.submitKyc
// );

// router.get('/status', kycController.getKycStatus);

// module.exports = router;
const express = require('express');
const router = express.Router();
const kycController = require('../controllers/userkyc.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { uploadKyc } = require('../middlewares/upload.middleware');

router.use(authMiddleware);

router.post(
  '/submit',
  ...uploadKyc,  // array spread karo
  kycController.submitKyc
);

router.get('/status', kycController.getKycStatus);

module.exports = router;