import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag, RefreshCw, Leaf, ShieldCheck, Users, Shirt, TrendingUp } from 'lucide-react';
import Button from '../components/ui/Button';
import ProductCard from '../components/ui/ProductCard';
import { CardSkeleton } from '../components/ui/SkeletonLoader';
import api from '../services/api';

const Home = () => {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await api.get('/listings?limit=8');
        setFeaturedItems(data.listings.slice(0, 8)); // Just get first 8 for home page
      } catch (error) {
        console.error("Failed to fetch featured items", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const categories = [
    { name: 'Vintage', image: 'https://images.unsplash.com/photo-1550614000-4b95d466f271?w=400&q=80' },
    { name: 'Streetwear', image: 'https://images.unsplash.com/photo-1523398002811-999aa8e9f564?w=400&q=80' },
    { name: 'Designer', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=80' },
    { name: 'Y2K', image: 'https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=400&q=80' },
    { name: 'Minimalist', image: 'https://images.unsplash.com/photo-1434389678219-450f3b927ac0?w=400&q=80' },
    { name: 'Accessories', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&q=80' }
  ];

  return (
    <div className="flex flex-col min-h-screen pb-20">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gray-50 pt-24 pb-32">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=2070&auto=format&fit=crop" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-50 via-gray-50/90 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block py-1 px-3 rounded-full bg-emerald-100 text-emerald-700 font-semibold text-sm mb-6 border border-emerald-200">
                Join 50k+ Sustainable Fashion Lovers
              </span>
              <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-6 leading-[1.1]">
                Buy, Sell & Swap <br />
                <span className="text-emerald-500">Clothes Sustainably.</span>
              </h1>
              <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-lg">
                The smart way to update your style. Trade your pre-loved pieces, discover unique vintage finds, and reduce fashion waste.
              </p>
              
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/browse">
                  <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg">
                    <ShoppingBag className="w-5 h-5 mr-2" /> Browse Items
                  </Button>
                </Link>
                <Link to="/create-listing">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 text-lg bg-white">
                    <RefreshCw className="w-5 h-5 mr-2" /> Start Selling
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-12 border-y border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gray-100">
            <div className="flex flex-col items-center">
              <Users className="w-8 h-8 text-emerald-500 mb-3" />
              <span className="text-3xl font-extrabold text-gray-700 mb-1">50k+</span>
              <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Active Users</span>
            </div>
            <div className="flex flex-col items-center">
              <Shirt className="w-8 h-8 text-blue-500 mb-3" />
              <span className="text-3xl font-extrabold text-gray-700 mb-1">120k+</span>
              <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Listings</span>
            </div>
            <div className="flex flex-col items-center">
              <RefreshCw className="w-8 h-8 text-green-500 mb-3" />
              <span className="text-3xl font-extrabold text-gray-700 mb-1">85k+</span>
              <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Successful Swaps</span>
            </div>
            <div className="flex flex-col items-center">
              <Leaf className="w-8 h-8 text-emerald-500 mb-3" />
              <span className="text-3xl font-extrabold text-gray-700 mb-1">1M+</span>
              <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Lbs CO2 Saved</span>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Shop by Category</h2>
              <p className="text-gray-500">Discover exactly what you're looking for</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, idx) => (
              <Link to={`/browse?category=${cat.name}`} key={idx}>
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="group relative h-40 rounded-2xl overflow-hidden cursor-pointer"
                >
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <h3 className="absolute bottom-4 left-4 text-white font-bold text-lg tracking-wide">{cat.name}</h3>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Items Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Fresh Finds</h2>
              <p className="text-gray-500">The latest pre-loved gems added by our community</p>
            </div>
            <Link to="/browse">
              <Button variant="ghost" className="text-emerald-600 hidden sm:flex">
                View All <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))
            ) : (
              featuredItems.map((item, index) => (
                <ProductCard key={item._id} listing={item} index={index} />
              ))
            )}
          </div>
          
          <div className="mt-10 sm:hidden flex justify-center">
             <Link to="/browse">
              <Button variant="outline" className="w-full">
                View All Listings
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trending Brands */}
      <section className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-10">Trending Brands</h2>
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            {['Nike', 'Carhartt', 'Stussy', 'Levi\'s', 'Patagonia', 'The North Face', 'Zara'].map((brand, i) => (
              <Link to={`/browse?brand=${brand}`} key={i}>
                <span className="px-6 py-3 rounded-full bg-white border border-gray-200 text-gray-600 font-bold hover:border-emerald-500 hover:text-emerald-600 transition-colors shadow-sm cursor-pointer">
                  {brand}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
    </div>
  );
};

export default Home;
