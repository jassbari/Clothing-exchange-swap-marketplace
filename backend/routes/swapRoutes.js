import express from 'express';
import {
  createSwapRequest,
  getSwapRequests,
  updateSwapStatus,
} from '../controllers/swapController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createSwapRequest)
  .get(protect, getSwapRequests);

router.route('/:id/status').put(protect, updateSwapStatus);

export default router;
