import SwapRequest from '../models/SwapRequest.js';
import Notification from '../models/Notification.js';

// @desc    Create a swap request
// @route   POST /api/swaps
// @access  Private
const createSwapRequest = async (req, res) => {
  try {
    const { receiverId, offeredListingId, requestedListingId, message } = req.body;

    const swapRequest = new SwapRequest({
      sender: req.user._id,
      receiver: receiverId,
      offeredListing: offeredListingId,
      requestedListing: requestedListingId,
      message,
    });

    const createdSwapRequest = await swapRequest.save();

    // Create Notification
    await Notification.create({
      user: receiverId,
      type: 'SWAP_REQUEST',
      message: `${req.user.name} sent you a swap request.`,
      link: `/swaps/${createdSwapRequest._id}`,
    });

    res.status(201).json(createdSwapRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get swap requests for user (sent or received)
// @route   GET /api/swaps
// @access  Private
const getSwapRequests = async (req, res) => {
  try {
    const swapRequests = await SwapRequest.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }],
    })
      .populate('sender', 'name profilePicture')
      .populate('receiver', 'name profilePicture')
      .populate('offeredListing', 'title images')
      .populate('requestedListing', 'title images')
      .sort({ createdAt: -1 });

    res.json(swapRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update swap request status
// @route   PUT /api/swaps/:id/status
// @access  Private
const updateSwapStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const swapRequest = await SwapRequest.findById(req.params.id).populate('sender receiver');

    if (!swapRequest) {
      res.status(404);
      throw new Error('Swap request not found');
    }

    // Ensure only receiver can accept/reject, either can cancel
    if (
      status === 'Accepted' || status === 'Rejected'
    ) {
      if (swapRequest.receiver._id.toString() !== req.user._id.toString()) {
         res.status(401);
         throw new Error('Not authorized to accept/reject this request');
      }
    }

    swapRequest.status = status;
    const updatedSwap = await swapRequest.save();

    // Notify sender
    let notificationType = '';
    let notificationMessage = '';
    if (status === 'Accepted') {
      notificationType = 'SWAP_ACCEPTED';
      notificationMessage = `${swapRequest.receiver.name} accepted your swap request!`;
    } else if (status === 'Rejected') {
      notificationType = 'SWAP_REJECTED';
      notificationMessage = `${swapRequest.receiver.name} rejected your swap request.`;
    }

    if (notificationType) {
      await Notification.create({
        user: swapRequest.sender._id,
        type: notificationType,
        message: notificationMessage,
        link: `/swaps/${updatedSwap._id}`,
      });
    }

    res.json(updatedSwap);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export { createSwapRequest, getSwapRequests, updateSwapStatus };
