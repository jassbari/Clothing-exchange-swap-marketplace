import Listing from '../models/Listing.js';
import cloudinary from '../config/cloudinary.js';

// @desc    Get all listings (with search, filter, sort, pagination)
// @route   GET /api/listings
// @access  Public
const getListings = async (req, res) => {
  try {
    const { keyword, category, brand, size, condition, location, sort, pageNumber } = req.query;
    const pageSize = 12;
    const page = Number(pageNumber) || 1;

    let query = { status: 'Available' };

    if (keyword) {
      query.title = { $regex: keyword, $options: 'i' };
    }
    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (size) query.size = size;
    if (condition) query.condition = condition;
    if (location) query['location.city'] = { $regex: location, $options: 'i' };

    let sortQuery = { createdAt: -1 }; // Latest default
    if (sort === 'value_asc') sortQuery = { estimatedValue: 1 };
    if (sort === 'value_desc') sortQuery = { estimatedValue: -1 };

    const count = await Listing.countDocuments(query);
    const listings = await Listing.find(query)
      .populate('owner', 'name profilePicture location')
      .sort(sortQuery)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({ listings, page, pages: Math.ceil(count / pageSize), count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get listing by ID
// @route   GET /api/listings/:id
// @access  Public
const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate(
      'owner',
      'name profilePicture location createdAt'
    );
    if (listing) {
      res.json(listing);
    } else {
      res.status(404);
      throw new Error('Listing not found');
    }
  } catch (error) {
    res.status(404).json({ message: 'Listing not found' });
  }
};

// @desc    Create a new listing
// @route   POST /api/listings
// @access  Private
const createListing = async (req, res) => {
  try {
    const {
      title, brand, category, size, color, gender, material, condition, description, estimatedValue, location
    } = req.body;

    let images = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        // Upload to Cloudinary using buffer
        const b64 = Buffer.from(file.buffer).toString("base64");
        let dataURI = "data:" + file.mimetype + ";base64," + b64;
        const uploadResponse = await cloudinary.uploader.upload(dataURI, {
          folder: 'clothing_exchange',
        });
        images.push({
          url: uploadResponse.secure_url,
          public_id: uploadResponse.public_id,
        });
      }
    }

    const listing = new Listing({
      owner: req.user._id,
      title, brand, category, size, color, gender, material, condition, description, estimatedValue,
      location: location ? JSON.parse(location) : req.user.location,
      images,
    });

    const createdListing = await listing.save();
    res.status(201).json(createdListing);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a listing
// @route   PUT /api/listings/:id
// @access  Private
const updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (listing) {
      // Check ownership
      if (listing.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(401);
        throw new Error('Not authorized to update this listing');
      }

      const { title, brand, category, size, color, gender, material, condition, description, estimatedValue } = req.body;

      listing.title = title || listing.title;
      listing.brand = brand || listing.brand;
      listing.category = category || listing.category;
      listing.size = size || listing.size;
      listing.color = color || listing.color;
      listing.gender = gender || listing.gender;
      listing.material = material || listing.material;
      listing.condition = condition || listing.condition;
      listing.description = description || listing.description;
      listing.estimatedValue = estimatedValue || listing.estimatedValue;

      if (req.body.location) {
          listing.location = JSON.parse(req.body.location);
      }

      // Handle new images if uploaded
      if (req.files && req.files.length > 0) {
        let newImages = [];
        for (const file of req.files) {
          const b64 = Buffer.from(file.buffer).toString("base64");
          let dataURI = "data:" + file.mimetype + ";base64," + b64;
          const uploadResponse = await cloudinary.uploader.upload(dataURI, {
            folder: 'clothing_exchange',
          });
          newImages.push({
            url: uploadResponse.secure_url,
            public_id: uploadResponse.public_id,
          });
        }
        // Optionally delete old images from Cloudinary here
        // For simplicity, we just replace them
        listing.images = newImages;
      }

      const updatedListing = await listing.save();
      res.json(updatedListing);
    } else {
      res.status(404);
      throw new Error('Listing not found');
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a listing
// @route   DELETE /api/listings/:id
// @access  Private
const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (listing) {
      if (listing.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(401);
        throw new Error('Not authorized to delete this listing');
      }

      // Delete images from Cloudinary
      if (listing.images && listing.images.length > 0) {
        for (const image of listing.images) {
          if (image.public_id) {
            await cloudinary.uploader.destroy(image.public_id);
          }
        }
      }

      await listing.deleteOne();
      res.json({ message: 'Listing removed' });
    } else {
      res.status(404);
      throw new Error('Listing not found');
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export { getListings, getListingById, createListing, updateListing, deleteListing };
