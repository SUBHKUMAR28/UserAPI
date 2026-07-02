// const express = require('express');
// const router = express.Router();
// const profileController = require('../controllers/profile.controller');
// const authMiddleware = require('../middlewares/auth.middleware');
// const validate = require('../middlewares/validate.middleware');
// const { uploadKyc } = require('../middlewares/upload.middleware');
// const { updateProfileSchema, kycSubmitSchema } = require('../validations/profile.validator');

// router.use(authMiddleware);

// router.get('/', profileController.getProfile);
// router.put('/', validate(updateProfileSchema), profileController.updateProfile);
// router.post('/upload-photo', uploadKyc.single('photo'), profileController.uploadPhoto);

// router.post(
//   '/kyc/submit',
//   uploadKyc.fields([
//     { name: 'pan_image', maxCount: 1 },
//     { name: 'aadhaar_front_image', maxCount: 1 },
//     { name: 'aadhaar_back_image', maxCount: 1 },
//   ]),
//   validate(kycSubmitSchema),
//   profileController.submitKyc
// );

// module.exports = router;

const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { uploadProfile, uploadKyc } = require('../middlewares/upload.middleware');
const { updateProfileSchema, kycSubmitSchema } = require('../validations/profile.validator');

router.use(authMiddleware);

router.get('/', profileController.getProfile);
router.put('/', validate(updateProfileSchema), profileController.updateProfile);

// uploadProfile use karo (uploadKyc.single nahi)
router.post('/upload-photo', uploadProfile, profileController.uploadPhoto);

// KYC submit
router.post(
  '/kyc/submit',
  uploadKyc,
  validate(kycSubmitSchema),
  profileController.submitKyc
);

module.exports = router;