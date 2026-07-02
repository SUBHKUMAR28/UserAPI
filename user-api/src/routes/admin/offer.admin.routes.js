// const createOffer = async (req, res) => {
//   res.status(200).json({ message: 'createOffer - coming soon' });
// };

// const getAllOffers = async (req, res) => {
//   res.status(200).json({ message: 'getAllOffers - coming soon' });
// };

// const updateOffer = async (req, res) => {
//   res.status(200).json({ message: 'updateOffer - coming soon' });
// };

// const deleteOffer = async (req, res) => {
//   res.status(200).json({ message: 'deleteOffer - coming soon' });
// };

// module.exports = { createOffer, getAllOffers, updateOffer, deleteOffer };
const express = require('express');
const router = express.Router();
const offerController = require('../../controllers/admin/offer.admin.controller');

router.post('/', offerController.createOffer);
router.get('/', offerController.getAllOffers);
router.put('/:id', offerController.updateOffer);
router.delete('/:id', offerController.deleteOffer);

module.exports = router;