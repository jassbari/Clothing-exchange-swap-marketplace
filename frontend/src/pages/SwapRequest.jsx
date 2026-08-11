import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';
import { motion } from 'framer-motion';
import { ArrowRightLeft, ShieldCheck, Check, AlertCircle, RefreshCw } from 'lucide-react';

const SwapRequest = () => {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [requestedListing, setRequestedListing] = useState(null);
  const [myListings, setMyListings] = useState([]);
  const [selectedMyListing, setSelectedMyListing] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [listingRes, myListingsRes] = await Promise.all([
          api.get(`/listings/${listingId}`),
          api.get(`/listings`) // we filter client side for now based on previous api setup
        ]);
        setRequestedListing(listingRes.data);
        
        // Filter out my listings to only available ones
        const available = (myListingsRes.data.listings || []).filter(l => l.owner._id === user._id && l.status === 'Available');
        setMyListings(available);
      } catch (err) {
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [listingId, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMyListing) return setError('Please select an item to offer');
    
    setSubmitting(true);
    setError('');
    
    try {
      await api.post('/swaps', {
        receiverId: requestedListing.owner._id,
        offeredListingId: selectedMyListing,
        requestedListingId: requestedListing._id,
        message
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send request');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
         <div className="animate-spin rounded-full h-8 w-8 border-4 border-emerald-200 border-t-emerald-600"></div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-lg w-full text-center border border-gray-100"
        >
          <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Request Sent!</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Your swap proposal has been sent to {requestedListing?.owner?.name}. We'll notify you as soon as they respond.
          </p>
          <Button onClick={() => navigate('/dashboard')} className="w-full h-12">
            Go to Dashboard
          </Button>
        </motion.div>
      </div>
    );
  }

  if (!requestedListing) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 bg-gray-50">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{error || 'Item not found'}</h2>
        <Button onClick={() => navigate('/browse')}>Back to Browse</Button>
      </div>
    );
  }

  const selectedListingObj = myListings.find(l => l._id === selectedMyListing);
  const valDiff = selectedListingObj ? selectedListingObj.estimatedValue - requestedListing.estimatedValue : null;

  return (
    <div className="bg-gray-50 min-h-screen py-10 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">Propose a Swap</h1>
          <p className="mt-3 text-gray-500 max-w-2xl mx-auto">
            Select an item from your wardrobe to trade with {requestedListing.owner.name}. Fair trades have a higher chance of being accepted!
          </p>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-start mb-8 max-w-3xl mx-auto">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{error}</p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row items-stretch justify-center gap-6 mb-12">
            
            {/* You Give (Your Item) */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full md:w-[45%] bg-white p-6 rounded-3xl shadow-soft border border-gray-100 flex flex-col relative"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full text-xs font-bold border border-emerald-200 uppercase tracking-wider">
                You Offer
              </div>
              
              {myListings.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <RefreshCw className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Wardrobe Empty</h3>
                  <p className="text-sm text-gray-500 mb-6">You need an active listing to propose a swap.</p>
                  <Button type="button" onClick={() => navigate('/create-listing')} className="shadow-sm">List an Item First</Button>
                </div>
              ) : (
                <div className="flex-1 flex flex-col h-full mt-2">
                  <label className="block text-sm font-bold text-gray-700 mb-3 text-center">Select from your wardrobe</label>
                  <select 
                    value={selectedMyListing} 
                    onChange={(e) => setSelectedMyListing(e.target.value)}
                    className="w-full p-3 mb-6 bg-gray-50 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-gray-900 transition-all appearance-none text-center"
                  >
                    <option value="">-- Choose an item --</option>
                    {myListings.map(l => (
                      <option key={l._id} value={l._id}>{l.title} (${l.estimatedValue})</option>
                    ))}
                  </select>
                  
                  <div className="mt-auto aspect-square rounded-2xl overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200 relative group">
                     {selectedListingObj?.images?.[0] ? (
                       <>
                         <img src={selectedListingObj.images[0].url} alt="Selected" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                         <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex justify-between items-end">
                            <span className="text-white font-semibold line-clamp-1 pr-4">{selectedListingObj.title}</span>
                            <span className="text-white font-bold">${selectedListingObj.estimatedValue}</span>
                         </div>
                       </>
                     ) : (
                       <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                         <RefreshCw className="w-8 h-8 mb-2 opacity-50" />
                         <span className="text-sm font-medium">No item selected</span>
                       </div>
                     )}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Exchange Icon */}
            <div className="hidden md:flex flex-col items-center justify-center px-2">
              <div className="w-14 h-14 bg-white rounded-full shadow-md flex items-center justify-center border border-gray-100 z-10 relative">
                <ArrowRightLeft className="w-6 h-6 text-emerald-500" />
              </div>
            </div>

            {/* You Get (Their Item) */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full md:w-[45%] bg-white p-6 rounded-3xl shadow-soft border border-gray-100 flex flex-col relative"
            >
               <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-800 text-white px-4 py-1 rounded-full text-xs font-bold border border-gray-700 uppercase tracking-wider">
                You Receive
              </div>

              <div className="flex items-center space-x-3 mb-6 mt-2 justify-center pb-4 border-b border-gray-100">
                <Avatar src={requestedListing.owner.profilePicture} alt={requestedListing.owner.name} size="sm" />
                <span className="font-semibold text-sm text-gray-700">From {requestedListing.owner.name}</span>
              </div>

              <div className="mt-auto aspect-square rounded-2xl overflow-hidden bg-gray-50 relative group">
                {requestedListing.images?.[0] ? (
                  <>
                    <img src={requestedListing.images[0].url} alt={requestedListing.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex justify-between items-end">
                       <span className="text-white font-semibold line-clamp-1 pr-4">{requestedListing.title}</span>
                       <span className="text-white font-bold text-lg">${requestedListing.estimatedValue}</span>
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">No Image</div>
                )}
              </div>
            </motion.div>
          </div>
          
          {/* Fair Trade Indicator */}
          {selectedListingObj && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              className={`max-w-2xl mx-auto mb-8 p-4 rounded-2xl border flex items-center justify-center space-x-3 ${
                Math.abs(valDiff) <= 20 
                  ? 'bg-green-50 border-green-200 text-green-700' 
                  : 'bg-yellow-50 border-yellow-200 text-yellow-700'
              }`}
            >
              <ShieldCheck className="w-6 h-6" />
              <div>
                <p className="font-bold text-sm">
                  {Math.abs(valDiff) <= 20 ? 'Looks like a fair trade!' : 'There is a value gap.'}
                </p>
                <p className="text-xs opacity-90">
                  {valDiff === 0 
                    ? 'Items have the exact same estimated value.' 
                    : valDiff > 0 
                      ? `Your item is valued ₹${Math.abs(valDiff)} higher.` 
                      : `Their item is valued ₹${Math.abs(valDiff)} higher.`
                  }
                </p>
              </div>
            </motion.div>
          )}

          {/* Message Area */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-3xl shadow-soft border border-gray-100 mb-8"
          >
            <label className="block text-sm font-bold text-gray-900 mb-3">Add a message (Optional)</label>
            <textarea 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              rows="3"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all text-gray-900 resize-none"
              placeholder="Hi! Would you be interested in swapping..."
            ></textarea>
            <p className="text-xs text-gray-500 mt-2">A friendly message increases the chances of a successful swap.</p>
          </motion.div>

          {/* Submit */}
          <div className="max-w-2xl mx-auto text-center">
            <Button 
              type="submit" 
              size="lg" 
              className="w-full md:w-auto px-12 h-14 shadow-lg shadow-emerald-500/30 text-lg" 
              isLoading={submitting} 
              disabled={!selectedMyListing}
            >
              Send Swap Proposal
            </Button>
            <p className="mt-4 text-xs text-gray-400">By sending this request, you agree to our Swap Guidelines.</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SwapRequest;
