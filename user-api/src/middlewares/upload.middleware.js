
// const multer = require('multer');
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
// const cloudinary = require('../config/cloudinary'); // apna cloudinary config file ka sahi path daalo

// // Storage config for profile photo
// const profileStorage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: 'profile_photos',
//     allowed_formats: ['jpg', 'jpeg', 'png'],
//   },
// });

// // Storage config for KYC documents
// const kycStorage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: 'kyc_documents',
//     allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
//   },
// });

// // Storage config for banner images
// const bannerStorage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: 'banners',
//     allowed_formats: ['jpg', 'jpeg', 'png'],
//   },
// });

// // Storage config for product images
// const productStorage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: 'products',
//     allowed_formats: ['jpg', 'jpeg', 'png'],
//   },
// });

// // Single file upload middleware (profile photo)
// const uploadProfile = multer({ storage: profileStorage }).single('photo');

// // Multiple fields upload middleware (KYC documents)
// const uploadKyc = multer({ storage: kycStorage }).fields([
//   { name: 'pan_image', maxCount: 1 },
//   { name: 'aadhaar_front_image', maxCount: 1 },
//   { name: 'aadhaar_back_image', maxCount: 1 },
// ]);

// // Single file upload middleware (banner image)
// const uploadBanner = multer({ storage: bannerStorage }).single('image');

// // Multiple images upload middleware (product images)
// const uploadProduct = multer({ storage: productStorage }).fields([
//   { name: 'images', maxCount: 10 },
// ]);

// module.exports = { uploadProfile, uploadKyc, uploadBanner, uploadProduct };

const multer = require('multer');
const sharp = require('sharp');
const cloudinary = require('../config/cloudinary'); // apna cloudinary config file ka sahi path daalo

// ===== Common memory storage (sab ke liye same) =====
const memoryUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB tak original allow, compress hone ke baad chhota ho jayega
  fileFilter: (req, file, cb) => {
    // KYC me PDF bhi allowed hai, baaki sab sirf image
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      return cb(null, true);
    }
    cb(new Error('Only image (and PDF for KYC) files are allowed'), false);
  },
});

// ===== Helper: ek buffer ko compress karke Cloudinary par upload karo =====
const compressAndUpload = async (file, folder) => {
  // PDF ko compress nahi karte, seedha upload karo
  if (file.mimetype === 'application/pdf') {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder, resource_type: 'raw' },
        (error, result) => (error ? reject(error) : resolve(result))
      );
      stream.end(file.buffer);
    });
  }

  const compressedBuffer = await sharp(file.buffer)
    .resize({ width: 1600, withoutEnlargement: true })
    .jpeg({ quality: 70 })
    .toBuffer();

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    stream.end(compressedBuffer);
  }).then((result) => {
    // size ko compressed buffer ke hisaab se overwrite karo
    result.bytes = compressedBuffer.length;
    return result;
  });
};

// Result ko multer-storage-cloudinary jaisa shape do (path, filename, size)
// taaki service files me kuch badalna na pade
const shapeFile = (file, result) => {
  file.path = result.secure_url;
  file.filename = result.public_id;
  file.size = result.bytes;
};

// ===== Profile photo (single file) =====
const uploadProfile = (req, res, next) => {
  memoryUpload.single('photo')(req, res, async (err) => {
    if (err) return next(err);
    if (!req.file) return next();
    try {
      const result = await compressAndUpload(req.file, 'profile_photos');
      shapeFile(req.file, result);
      next();
    } catch (e) {
      next(e);
    }
  });
};

// ===== KYC documents (multiple fields) =====
const uploadKyc = (req, res, next) => {
  memoryUpload.fields([
    { name: 'pan_image', maxCount: 1 },
    { name: 'aadhaar_front_image', maxCount: 1 },
    { name: 'aadhaar_back_image', maxCount: 1 },
  ])(req, res, async (err) => {
    if (err) return next(err);
    if (!req.files) return next();
    try {
      for (const field of Object.keys(req.files)) {
        const file = req.files[field][0];
        const result = await compressAndUpload(file, 'kyc_documents');
        shapeFile(file, result);
      }
      next();
    } catch (e) {
      next(e);
    }
  });
};

// ===== Banner image (single file) =====
const uploadBanner = (req, res, next) => {
  memoryUpload.single('image')(req, res, async (err) => {
    if (err) return next(err);
    if (!req.file) return next();
    try {
      const result = await compressAndUpload(req.file, 'banners');
      shapeFile(req.file, result);
      next();
    } catch (e) {
      next(e);
    }
  });
};

// ===== Product images (multiple files, same field) =====
const uploadProduct = (req, res, next) => {
  memoryUpload.fields([{ name: 'images', maxCount: 10 }])(req, res, async (err) => {
    if (err) return next(err);
    if (!req.files || !req.files.images) return next();
    try {
      for (const file of req.files.images) {
        const result = await compressAndUpload(file, 'products');
        shapeFile(file, result);
      }
      next();
    } catch (e) {
      next(e);
    }
  });
};

module.exports = { uploadProfile, uploadKyc, uploadBanner, uploadProduct };