import express from 'express';
import {
  getListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
} from '../controllers/listingController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getListings)
  .post(protect, upload.array('images', 5), createListing); // Max 5 images

router.route('/:id')
  .get(getListingById)
  .put(protect, upload.array('images', 5), updateListing)
  .delete(protect, deleteListing);

export default router;
