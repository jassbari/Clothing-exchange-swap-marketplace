import mongoose from 'mongoose';

const swapRequestSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    offeredListing: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Listing',
    },
    requestedListing: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Listing',
    },
    message: {
      type: String,
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

const SwapRequest = mongoose.model('SwapRequest', swapRequestSchema);

export default SwapRequest;
