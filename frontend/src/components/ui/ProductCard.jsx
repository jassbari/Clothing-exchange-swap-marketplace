import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import Badge from './Badge';

const ProductCard = ({ listing, index = 0 }) => {
  const [isLiked, setIsLiked] = useState(false);
  const navigate = useNavigate();

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
    // TODO: Add API call to wishlist
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden cursor-pointer"
      onClick={() => navigate(`/listings/${listing._id}`)}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 rounded-2xl">
        {listing.images && listing.images.length > 0 ? (
          <img
            src={listing.images[0].url}
            alt={listing.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}

        {/* Overlay Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {listing.brand && (
            <Badge variant="outline" className="bg-white backdrop-blur-sm shadow-sm font-bold text-[10px]">
              {listing.brand}
            </Badge>
          )}
        </div>
        
        <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
          <button 
            onClick={handleLike}
            className={`p-2 rounded-full backdrop-blur-md transition-all duration-300 ${isLiked ? 'bg-white shadow-md' : 'bg-white hover:bg-white shadow-sm'}`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
          </button>
        </div>

        {/* Condition Badge Bottom Left */}
        <div className="absolute bottom-3 left-3">
          <Badge variant="default" className="bg-white backdrop-blur-sm shadow-sm">
            {listing.condition}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="pt-3 pb-1 px-1">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-sm font-semibold text-gray-700 truncate pr-2 group-hover:text-emerald-600 transition-colors">
            {listing.title}
          </h3>
          <span className="text-sm font-bold text-gray-700 shrink-0">
            ₹{listing.estimatedValue}
          </span>
        </div>
        
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span className="truncate">{listing.size}</span>
          {listing.owner && listing.owner.name && (
            <span className="truncate ml-2 text-gray-400">by {listing.owner.name}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
