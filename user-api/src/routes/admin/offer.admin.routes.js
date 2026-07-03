

// module.exports = { createOffer, getAllOffers, updateOffer, deleteOffer };
// const express = require('express');
// const router = express.Router();
// const offerController = require('../../controllers/admin/offer.admin.controller');

// router.post('/', offerController.createOffer);
// router.get('/', offerController.getAllOffers);
// router.put('/:id', offerController.updateOffer);
// router.delete('/:id', offerController.deleteOffer);

// module.exports = router;
const express = require('express');
const router = express.Router();
const offerController = require('../../controllers/admin/offer.admin.controller');

router.post('/', offerController.createOffer);
router.get('/', offerController.getAllOffers);
router.get('/:id', offerController.getOfferById);
router.put('/:id', offerController.updateOffer);
router.delete('/:id', offerController.deleteOffer);

// Product link/unlink karne ke routes
router.post('/:id/add-product', offerController.addProductToOffer);
router.post('/:id/remove-product', offerController.removeProductFromOffer);

module.exports = router;