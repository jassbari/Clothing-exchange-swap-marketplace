import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import { 
  MapPin, 
  RefreshCw, 
  AlertCircle, 
  Heart, 
  MessageCircle, 
  ChevronLeft, 
  Share, 
  Clock,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImage, setActiveImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const { data } = await api.get(`/listings/${id}`);
        setListing(data);
      } catch (err) {
        setError('Failed to load item details');
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-200 border-t-emerald-600"></div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{error || 'Item not found'}</h2>
        <Button onClick={() => navigate('/browse')}>Back to Browse</Button>
      </div>
    );
  }

  const isOwner = user && user._id === listing.owner._id;

  return (
    <div className="bg-gray-50 min-h-screen pb-20 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-1" /> Back
          </button>
          
          <div className="flex space-x-3">
            <button className="p-2 bg-white rounded-full text-gray-500 hover:text-red-500 shadow-sm transition-all hover:shadow-md">
              <Heart className="w-5 h-5" />
            </button>
            <button className="p-2 bg-white rounded-full text-gray-500 hover:text-emerald-500 shadow-sm transition-all hover:shadow-md">
              <Share className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column - Image Gallery */}
          <div className="lg:col-span-7 space-y-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className={`relative aspect-[3/4] sm:aspect-square lg:aspect-[4/5] bg-gray-100 rounded-3xl overflow-hidden cursor-zoom-in ${isZoomed ? 'z-50 fixed inset-0 m-0 w-screen h-screen bg-black/90 cursor-zoom-out rounded-none flex items-center justify-center' : 'shadow-soft border border-gray-100'}`}
              onClick={() => setIsZoomed(!isZoomed)}
            >
              {listing.images && listing.images.length > 0 ? (
                <img 
                  src={listing.images[activeImage].url} 
                  alt={listing.title} 
                  className={`object-cover transition-transform duration-500 ${isZoomed ? 'w-auto h-auto max-w-full max-h-full object-contain' : 'w-full h-full'}`}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
              )}
              
              {!isZoomed && (
                <div className="absolute bottom-4 left-4 flex gap-2">
                  <Badge variant="primary" className="bg-white backdrop-blur-md px-3 py-1.5 shadow-sm text-sm">
                    {listing.brand}
                  </Badge>
                </div>
              )}
            </motion.div>

            {/* Thumbnail Gallery */}
            {!isZoomed && listing.images && listing.images.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
                {listing.images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`snap-start w-20 h-24 sm:w-24 sm:h-32 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all duration-300 ${activeImage === idx ? 'border-emerald-500 scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img src={img.url} alt={`thumbnail ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Product Info */}
          <div className="lg:col-span-5 flex flex-col">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-gray-100 sticky top-24"
            >
              
              {/* Seller Mini Profile */}
              <Link to={`/profile/${listing.owner._id}`} className="flex items-center space-x-4 mb-6 pb-6 border-b border-gray-100 group">
                <Avatar src={listing.owner.profilePicture} alt={listing.owner.name} size="lg" className="border-gray-100 group-hover:border-emerald-200 transition-colors" />
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors flex items-center">
                    {listing.owner.name}
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-1" />
                  </h4>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <span className="flex items-center mr-3"><div className="w-2 h-2 bg-green-500 rounded-full mr-1.5 animate-pulse"></div> Active recently</span>
                  </div>
                </div>
              </Link>

              {/* Title & Value */}
              <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3 leading-tight">{listing.title}</h1>
                <div className="flex items-end space-x-3">
                  <span className="text-4xl font-black text-emerald-600">₹{listing.estimatedValue}</span>
                  <span className="text-sm font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Est. Value</span>
                </div>
              </div>

              {/* Attributes Grid */}
              <div className="grid grid-cols-2 gap-y-4 gap-x-6 py-6 border-y border-gray-100 mb-6 bg-gray-50 rounded-2xl px-4 mt-2">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Brand</span>
                  <span className="font-bold text-gray-900">{listing.brand || 'Unbranded'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Size</span>
                  <span className="font-bold text-gray-900 bg-white border border-gray-200 px-2 py-0.5 rounded-md self-start">{listing.size}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Condition</span>
                  <span className="font-bold text-gray-900">{listing.condition}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Color</span>
                  <span className="font-bold text-gray-900 flex items-center">
                    <span className="w-3 h-3 rounded-full border border-gray-200 mr-2" style={{backgroundColor: listing.color?.toLowerCase() || '#ddd'}}></span>
                    {listing.color || 'Multi'}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                  {listing.description}
                </p>
                
                <div className="flex items-center text-xs text-gray-400 mt-4 space-x-4">
                  <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1" /> Listed 2 days ago</span>
                  {listing.owner.location && (
                    <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1" /> {listing.owner.location.city || 'Local'}</span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 mt-auto">
                {!user ? (
                  <Button size="lg" className="w-full h-14" onClick={() => navigate('/login')}>
                    Sign in to Swap
                  </Button>
                ) : isOwner ? (
                  <Button variant="outline" size="lg" className="w-full h-14" onClick={() => navigate(`/edit-listing/${listing._id}`)}>
                    Edit Listing
                  </Button>
                ) : (
                  <>
                    <Button size="lg" className="w-full h-14 shadow-lg shadow-emerald-500/20 text-lg" onClick={() => navigate(`/swap-request/${listing._id}`)}>
                      <RefreshCw className="w-5 h-5 mr-2" /> Propose Swap
                    </Button>
                    <Button variant="outline" size="lg" className="w-full h-14 bg-white" onClick={() => navigate(`/chat/${listing.owner._id}`)}>
                      <MessageCircle className="w-5 h-5 mr-2" /> Chat with Seller
                    </Button>
                  </>
                )}
              </div>
              
              {/* Buyer Protection Banner */}
              <div className="mt-6 bg-blue-50 p-4 rounded-2xl flex items-start border border-blue-100">
                <ShieldCheck className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h5 className="text-sm font-bold text-blue-900">Buyer Protection</h5>
                  <p className="text-xs text-blue-700 mt-1 leading-snug">Every swap is protected. If the item isn't as described, you're covered by our return policy.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;
