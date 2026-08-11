import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: [true, 'Please add a clothing name/title'],
    },
    brand: {
      type: String,
      required: [true, 'Please add a brand'],
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
    },
    size: {
      type: String,
      required: [true, 'Please add a size'],
    },
    color: {
      type: String,
      required: [true, 'Please add a color'],
    },
    gender: {
      type: String,
      required: [true, 'Please add a gender'],
    },
    material: {
      type: String,
    },
    condition: {
      type: String,
      enum: ['New', 'Like New', 'Good', 'Fair'],
      required: [true, 'Please add a condition'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    estimatedValue: {
      type: Number,
      required: [true, 'Please add an estimated swap value'],
    },
    images: [
      {
        url: String,
        public_id: String,
      },
    ],
    location: {
      city: String,
      state: String,
    },
    status: {
      type: String,
      enum: ['Available', 'Pending Swap', 'Swapped', 'Hidden'],
      default: 'Available',
    },
  },
  {
    timestamps: true,
  }
);

const Listing = mongoose.model('Listing', listingSchema);

export default Listing;
