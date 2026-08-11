import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  Package, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  Wallet, 
  Settings, 
  ChevronRight,
  TrendingUp,
  MessageCircle,
  Bell
} from 'lucide-react';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';

const Dashboard = () => {
  const { user } = useAuth();
  const [myListings, setMyListings] = useState([]);
  const [swapRequests, setSwapRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [listingsRes, requestsRes] = await Promise.all([
          api.get(`/listings`),
          api.get('/swaps')
        ]);
        const allListings = listingsRes.data.listings || [];
        setMyListings(allListings.filter(l => l.owner._id === user._id));
        setSwapRequests(requestsRes.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-200 border-t-emerald-600"></div>
      </div>
    );
  }

  const pendingRequests = swapRequests.filter(r => r.status === 'Pending');
  const activeListings = myListings.filter(l => l.status === 'Available');
  const completedSwaps = swapRequests.filter(r => r.status === 'Completed');
  
  const estimatedValueSaved = completedSwaps.length > 0 
    ? completedSwaps.reduce((acc, swap) => acc + (swap.requestedItem?.value || swap.requestedItem?.price || 0), 0)
    : 0;

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      
      {/* Profile Header (Cover + Avatar) */}
      <div className="bg-white border-b border-gray-200">
        <div className="h-48 md:h-64 bg-gradient-to-r from-emerald-400 to-blue-500 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative pb-8">
          <div className="flex flex-col md:flex-row md:items-end -mt-16 md:-mt-20 mb-6">
            <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-emerald-500 text-white flex items-center justify-center text-3xl md:text-5xl font-semibold border-4 border-white shadow-lg">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="mt-4 md:mt-0 md:ml-6 flex-1">
              <h1 className="text-3xl font-extrabold text-gray-900">{user.name}</h1>
            </div>
            <div className="mt-6 md:mt-0 flex space-x-3">
              <Button variant="outline" className="bg-white shadow-sm">
                <Settings className="w-4 h-4 mr-2" /> Edit Profile
              </Button>
            </div>
          </div>
          
          <p className="text-gray-600 max-w-2xl mb-6">
            {user.bio || "Hi, I'm a sustainable fashion enthusiast looking to trade my pre-loved wardrobe for new styles. Open to negotiations!"}
          </p>

          <div className="flex space-x-6 text-sm font-medium border-t border-gray-100 pt-6">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-900">{myListings.length}</span>
              <span className="text-gray-500">Listings</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-900">{completedSwaps.length}</span>
              <span className="text-gray-500">Swaps</span>
            </div>

          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div whileHover={{ y: -2 }} className="bg-white p-5 rounded-2xl shadow-soft border border-gray-100 flex items-center space-x-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Active Listings</p>
              <h3 className="text-2xl font-black text-gray-900 leading-none">{activeListings.length}</h3>
            </div>
          </motion.div>
          
          <motion.div whileHover={{ y: -2 }} className="bg-white p-5 rounded-2xl shadow-soft border border-gray-100 flex items-center space-x-4">
            <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-2xl flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Pending Swaps</p>
              <h3 className="text-2xl font-black text-gray-900 leading-none">{pendingRequests.length}</h3>
            </div>
          </motion.div>

          <motion.div whileHover={{ y: -2 }} className="bg-white p-5 rounded-2xl shadow-soft border border-gray-100 flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Completed</p>
              <h3 className="text-2xl font-black text-gray-900 leading-none">{completedSwaps.length}</h3>
            </div>
          </motion.div>

          <motion.div whileHover={{ y: -2 }} className="bg-white p-5 rounded-2xl shadow-soft border border-gray-100 flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Est. Value Saved</p>
              <h3 className="text-2xl font-black text-gray-900 leading-none">₹{estimatedValueSaved}</h3>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Area (2 cols) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* My Listings */}
            <div className="bg-white rounded-3xl shadow-soft border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                <h2 className="text-xl font-bold text-gray-900">My Wardrobe</h2>
                <Link to="/create-listing">
                  <Button size="sm" className="shadow-sm">Add Item</Button>
                </Link>
              </div>
              
              <div className="p-6">
                {myListings.length === 0 ? (
                  <div className="text-center py-10">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-900">Your wardrobe is empty</h3>
                    <p className="text-gray-500 mt-1 mb-6 text-sm">Start uploading your pre-loved clothes to trade.</p>
                    <Link to="/create-listing"><Button variant="outline">List Your First Item</Button></Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {myListings.map((listing) => (
                      <Link to={`/edit-listing/${listing._id}`} key={listing._id} className="group relative block rounded-2xl overflow-hidden bg-gray-100 aspect-[3/4] border border-gray-200">
                        {listing.images && listing.images.length > 0 && (
                          <img src={listing.images[0].url} alt={listing.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-100 flex flex-col justify-end p-3">
                          <h4 className="text-white font-semibold text-sm truncate">{listing.title}</h4>
                          <span className="text-white/80 text-xs">₹{listing.estimatedValue}</span>
                        </div>
                        <div className="absolute top-2 right-2">
                          <Badge variant={listing.status === 'Available' ? 'success' : 'default'} className="shadow-sm">
                            {listing.status}
                          </Badge>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Swap Requests */}
            <div className="bg-white rounded-3xl shadow-soft border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                 <h2 className="text-xl font-bold text-gray-900">Recent Swap Requests</h2>
                 <Link to="/swaps" className="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center">View All <ChevronRight className="w-4 h-4 ml-1" /></Link>
              </div>
              
              <div className="p-0">
                {swapRequests.length === 0 ? (
                  <div className="text-center py-10 px-6">
                    <RefreshCw className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No swap requests yet. When someone wants to trade with you, it will appear here.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {swapRequests.slice(0, 5).map(request => {
                      const isSender = request.sender._id === user._id;
                      const otherUser = isSender ? request.receiver : request.sender;
                      
                      return (
                        <div key={request._id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="relative flex-shrink-0">
                               <Avatar src={otherUser?.profilePicture} alt={otherUser?.name || '?'} size="md" />
                               <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm border border-gray-100">
                                  <RefreshCw className="w-3.5 h-3.5 text-emerald-500" />
                               </div>
                            </div>
                            <div>
                              <p className="text-sm text-gray-900 leading-snug">
                                {isSender ? (
                                  <>You offered to swap for <span className="font-bold">{request.requestedListing?.title || 'an item'}</span></>
                                ) : (
                                  <><span className="font-bold">{otherUser?.name || 'Someone'}</span> wants your <span className="font-bold">{request.requestedListing?.title || 'item'}</span></>
                                )}
                              </p>
                              <div className="flex items-center mt-1 space-x-2">
                                <Badge variant={
                                  request.status === 'Pending' ? 'warning' :
                                  request.status === 'Accepted' ? 'success' :
                                  request.status === 'Rejected' ? 'danger' : 'default'
                                }>
                                  {request.status}
                                </Badge>
                                <span className="text-xs text-gray-400 flex items-center"><Clock className="w-3 h-3 mr-1" /> 2 hours ago</span>
                              </div>
                            </div>
                          </div>
                          <Link to="/swaps" className="text-gray-400 hover:text-emerald-600 transition-colors p-2">
                            <ChevronRight className="w-5 h-5" />
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-8">
            
            {/* Activity Timeline */}
            <div className="bg-white rounded-3xl shadow-soft border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Activity</h2>
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-green-100 text-green-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10 ml-0 md:ml-auto">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] pl-4 md:pl-0 md:pr-4 md:group-even:pl-4 md:group-even:pr-0">
                    <div className="flex flex-col bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <span className="text-xs text-gray-400 mb-1 font-medium tracking-wide uppercase">Today</span>
                      <p className="text-sm font-medium text-gray-900 leading-snug">Swap successful with Emily for Vintage Denim Jacket</p>
                    </div>
                  </div>
                </div>

                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-blue-100 text-blue-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10 ml-0 md:ml-auto">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] pl-4 md:pl-0 md:pr-4 md:group-even:pl-4 md:group-even:pr-0">
                    <div className="flex flex-col bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <span className="text-xs text-gray-400 mb-1 font-medium tracking-wide uppercase">Yesterday</span>
                      <p className="text-sm font-medium text-gray-900 leading-snug">New message from Alex regarding Nike Dunks</p>
                    </div>
                  </div>
                </div>

                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-emerald-100 text-emerald-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10 ml-0 md:ml-auto">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] pl-4 md:pl-0 md:pr-4 md:group-even:pl-4 md:group-even:pr-0">
                    <div className="flex flex-col bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <span className="text-xs text-gray-400 mb-1 font-medium tracking-wide uppercase">Oct 12</span>
                      <p className="text-sm font-medium text-gray-900 leading-snug">Listed a new item: North Face Puffer Jacket</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-emerald-500 rounded-3xl shadow-soft p-6 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400 rounded-bl-full opacity-50"></div>
               <div className="absolute bottom-[-20%] left-[-10%] w-24 h-24 bg-emerald-600 rounded-tr-full opacity-50"></div>
               
               <h3 className="font-bold text-xl mb-2 relative z-10">Time to clear out?</h3>
               <p className="text-emerald-100 text-sm mb-6 relative z-10">Turn your unworn clothes into new favorites. List them today!</p>
               <Link to="/create-listing" className="relative z-10 block">
                 <Button className="w-full bg-white text-emerald-600 hover:bg-gray-50">List an Item</Button>
               </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
