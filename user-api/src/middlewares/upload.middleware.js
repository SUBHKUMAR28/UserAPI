
// const multer = require('multer');
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
// const cloudinary = require('../config/cloudinary');

// const createStorage = (folder) =>
//   new CloudinaryStorage({
//     cloudinary,
//     params: { folder, allowed_formats: ['jpg', 'jpeg', 'png', 'webp'] },
//   });

// const uploadBanner = multer({ storage: createStorage('banners') });
// const uploadKyc = multer({ storage: createStorage('kyc') });
// const uploadProduct = multer({ storage: createStorage('products') });

// module.exports = { uploadBanner, uploadKyc, uploadProduct };

// const multer = require('multer');
// const sharp = require('sharp');
// const cloudinary = require('../config/cloudinary');
// const { Readable } = require('stream');

// // Memory storage - pehle RAM me rakhenge, compress karke Cloudinary pe bhejenge
// const memoryStorage = multer.memoryStorage();

// // Compress + Cloudinary upload helper
// const compressAndUpload = async (buffer, folder, filename) => {
//   let quality = 80;
//   let finalBuffer = await sharp(buffer)
//     .resize({ width: 1200, withoutEnlargement: true })
//     .jpeg({ quality })
//     .toBuffer();

//   // Agar 200KB se bada hai, quality kam karte jao
//   while (finalBuffer.length > 200 * 1024 && quality > 10) {
//     quality -= 10;
//     finalBuffer = await sharp(buffer)
//       .resize({ width: 1200, withoutEnlargement: true })
//       .jpeg({ quality })
//       .toBuffer();
//   }

//   // Cloudinary pe stream se upload karo
//   return new Promise((resolve, reject) => {
//     const uploadStream = cloudinary.uploader.upload_stream(
//       { folder, public_id: filename, resource_type: 'image' },
//       (error, result) => {
//         if (error) reject(error);
//         else resolve(result);
//       }
//     );
//     Readable.from(finalBuffer).pipe(uploadStream);
//   });
// };

// // Compression middleware banane ka helper
// const compressionMiddleware = async (req, res, next) => {
//   try {
//     if (!req.files && !req.file) return next();

//     // Multiple files (fields) handle karo
//     if (req.files && typeof req.files === 'object') {
//       for (const fieldName of Object.keys(req.files)) {
//         for (let i = 0; i < req.files[fieldName].length; i++) {
//           const file = req.files[fieldName][i];
//           const filename = `${Date.now()}-${i}`;
//           const result = await compressAndUpload(
//             file.buffer,
//             file.cloudinaryFolder,
//             filename
//           );
//           req.files[fieldName][i].path = result.secure_url;
//         }
//       }
//     }

//     // Single file handle karo
//     if (req.file) {
//       const filename = `${Date.now()}`;
//       const result = await compressAndUpload(
//         req.file.buffer,
//         req.file.cloudinaryFolder,
//         filename
//       );
//       req.file.path = result.secure_url;
//     }

//     next();
//   } catch (error) {
//     next(error);
//   }
// };

// // Folder tag lagane ka middleware
// const tagFolder = (folder) => (req, res, next) => {
//   if (req.files) {
//     Object.keys(req.files).forEach((key) => {
//       req.files[key].forEach((file) => {
//         file.cloudinaryFolder = folder;
//       });
//     });
//   }
//   if (req.file) req.file.cloudinaryFolder = folder;
//   next();
// };

// // Base multer config (memory me lo)
// const upload = multer({
//   storage: memoryStorage,
//   limits: { fileSize: 10 * 1024 * 1024 }, // max 10MB input
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype.startsWith('image/')) {
//       cb(null, true);
//     } else {
//       cb(new Error('Only image files allowed'), false);
//     }
//   },
// });

// // -------- EXPORTS --------

// // Banner upload (single image)
// const uploadBanner = [
//   upload.single('image'),
//   tagFolder('lockpe/banners'),
//   compressionMiddleware,
// ];

// // KYC documents upload (4 images)
// const uploadKyc = [
//   upload.fields([
//     { name: 'pan_image', maxCount: 1 },
//     { name: 'aadhaar_front_image', maxCount: 1 },
//     { name: 'aadhaar_back_image', maxCount: 1 },
//     { name: 'selfie_image', maxCount: 1 },
//   ]),
//   tagFolder('lockpe/kyc'),
//   compressionMiddleware,
// ];

// // Product images upload (max 5)
// const uploadProduct = [
//   upload.fields([{ name: 'images', maxCount: 5 }]),
//   tagFolder('lockpe/products'),
//   compressionMiddleware,
// ];

// // Profile photo upload (single)
// const uploadProfile = [
//   upload.single('photo'),
//   tagFolder('lockpe/profile'),
//   compressionMiddleware,
// ];

// module.exports = { uploadBanner, uploadKyc, uploadProduct, uploadProfile };

// const productService = require('../../services/admin/product.admin.service');
// middlewares/ se services/ tak sirf ek "../" chahiye

const productService = require('../services/admin/product.admin.service');
const catchAsync = require('../utils/catchAsync');
const { success } = require('../utils/apiResponse');

exports.createProduct = catchAsync(async (req, res) => {
  // req.files ek OBJECT hai (upload.fields se), Array nahi
  const images = req.files?.images
    ? req.files.images.map((file) => file.path)
    : [];

  const productData = {
    ...req.body,
    images,
  };

  const product = await productService.createProduct(productData);
  return success(res, 201, 'Product created successfully', product);
});

exports.getAllProducts = catchAsync(async (req, res) => {
  const products = await productService.getAllProducts();
  return success(res, 200, 'Products fetched successfully', products);
});

exports.updateProduct = catchAsync(async (req, res) => {
  const updateData = { ...req.body };

  if (req.files?.images && req.files.images.length > 0) {
    updateData.images = req.files.images.map((file) => file.path);
  }

  const product = await productService.updateProduct(req.params.id, updateData);
  return success(res, 200, 'Product updated successfully', product);
});

exports.deleteProduct = catchAsync(async (req, res) => {
  await productService.deleteProduct(req.params.id);
  return success(res, 200, 'Product deleted successfully');
});