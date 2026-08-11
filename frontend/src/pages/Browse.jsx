import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Button from '../components/ui/Button';
import ProductCard from '../components/ui/ProductCard';
import { CardSkeleton } from '../components/ui/SkeletonLoader';
import { Search, SlidersHorizontal, ChevronDown, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Browse = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Parse URL query params
  const queryParams = new URLSearchParams(location.search);
  
  const [filters, setFilters] = useState({
    keyword: queryParams.get('keyword') || '',
    category: queryParams.get('category') || '',
    brand: queryParams.get('brand') || '',
    size: queryParams.get('size') || '',
    condition: queryParams.get('condition') || '',
    sort: queryParams.get('sort') || 'latest',
  });

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const fetchListings = async () => {
    setLoading(true);
    try {
      let query = `/listings?`;
      Object.entries(filters).forEach(([key, value]) => {
        if (value) query += `${key}=${value}&`;
      });
      
      const { data } = await api.get(query);
      setListings(data.listings);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
    // Update URL when filters change
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    navigate({ search: params.toString() }, { replace: true });
    // eslint-disable-next-line
  }, [filters.category, filters.condition, filters.sort, filters.brand, filters.size]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchListings();
  };

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      keyword: '',
      category: '',
      brand: '',
      size: '',
      condition: '',
      sort: 'latest'
    });
    navigate('/browse', { replace: true });
  };

  const activeFilterCount = Object.values(filters).filter(v => v !== '' && v !== 'latest').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Top Bar (Title & Search) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Browse Items</h1>
          <p className="text-gray-500 mt-1">{listings.length} results found</p>
        </div>
        
        <form onSubmit={handleSearch} className="flex w-full md:w-auto relative group">
          <input
            type="text"
            placeholder="Search items, brands..."
            value={filters.keyword}
            onChange={(e) => updateFilter('keyword', e.target.value)}
            className="w-full md:w-80 pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
          />
          <Search className="absolute left-4 top-3 h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
          <button type="submit" className="hidden"></button>
        </form>
      </div>

      {/* Mobile Filter Toggle */}
      <div className="md:hidden flex justify-between items-center mb-6">
        <Button 
          variant="outline" 
          onClick={() => setIsMobileFiltersOpen(true)}
          className="w-full relative"
        >
          <SlidersHorizontal className="w-5 h-5 mr-2" />
          Filters & Sort
          {activeFilterCount > 0 && (
            <span className="absolute top-2 right-2 flex h-3 w-3 items-center justify-center rounded-full bg-emerald-500 text-[10px] text-white p-2">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Desktop Sidebar Filters */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <div className="sticky top-28 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-900 flex items-center">
                <SlidersHorizontal className="w-5 h-5 mr-2" /> Filters
              </h3>
              {activeFilterCount > 0 && (
                <button onClick={clearFilters} className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">
                  Clear All
                </button>
              )}
            </div>
            
            <div className="space-y-6">
              {/* Sort By */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Sort By</label>
                <div className="relative">
                  <select 
                    className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2.5 px-4 pr-8 rounded-xl leading-tight focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-medium text-sm"
                    value={filters.sort}
                    onChange={(e) => updateFilter('sort', e.target.value)}
                  >
                    <option value="latest">Latest Arrivals</option>
                    <option value="value_asc">Price: Low to High</option>
                    <option value="value_desc">Price: High to Low</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Category</label>
                <div className="space-y-2">
                  {['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes', 'Accessories'].map(cat => (
                    <label key={cat} className="flex items-center group cursor-pointer">
                      <input 
                        type="radio" 
                        name="category"
                        value={cat}
                        checked={filters.category === cat}
                        onChange={() => updateFilter('category', cat)}
                        className="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
                      />
                      <span className={`ml-3 text-sm font-medium ${filters.category === cat ? 'text-emerald-700' : 'text-gray-600 group-hover:text-gray-900'}`}>{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Condition */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Condition</label>
                <div className="space-y-2">
                  {['New', 'Like New', 'Good', 'Fair'].map(cond => (
                    <label key={cond} className="flex items-center group cursor-pointer">
                      <input 
                        type="radio" 
                        name="condition"
                        value={cond}
                        checked={filters.condition === cond}
                        onChange={() => updateFilter('condition', cond)}
                        className="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
                      />
                      <span className={`ml-3 text-sm font-medium ${filters.condition === cond ? 'text-emerald-700' : 'text-gray-600 group-hover:text-gray-900'}`}>{cond}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Filters Modal */}
        <AnimatePresence>
          {isMobileFiltersOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 md:hidden"
                onClick={() => setIsMobileFiltersOpen(false)}
              />
              <motion.div 
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-x-0 bottom-0 h-[85vh] bg-white rounded-t-3xl z-50 md:hidden overflow-hidden flex flex-col shadow-2xl"
              >
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0">
                  <h3 className="font-bold text-lg text-gray-900">Filters</h3>
                  <button onClick={() => setIsMobileFiltersOpen(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
                
                <div className="p-6 overflow-y-auto flex-grow space-y-8">
                  {/* Same filters as desktop */}
                  <div>
                    <label className="block text-base font-bold text-gray-900 mb-3">Sort By</label>
                    <select 
                      className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 rounded-xl font-medium"
                      value={filters.sort}
                      onChange={(e) => updateFilter('sort', e.target.value)}
                    >
                      <option value="latest">Latest Arrivals</option>
                      <option value="value_asc">Price: Low to High</option>
                      <option value="value_desc">Price: High to Low</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-base font-bold text-gray-900 mb-3">Category</label>
                    <div className="flex flex-wrap gap-2">
                      {['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes', 'Accessories'].map(cat => (
                        <button
                          key={cat}
                          onClick={() => updateFilter('category', cat === filters.category ? '' : cat)}
                          className={`px-4 py-2 rounded-full text-sm font-semibold border ${filters.category === cat ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-base font-bold text-gray-900 mb-3">Condition</label>
                    <div className="flex flex-wrap gap-2">
                      {['New', 'Like New', 'Good', 'Fair'].map(cond => (
                        <button
                          key={cond}
                          onClick={() => updateFilter('condition', cond === filters.condition ? '' : cond)}
                          className={`px-4 py-2 rounded-full text-sm font-semibold border ${filters.condition === cond ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
                        >
                          {cond}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border-t border-gray-100 bg-white grid grid-cols-2 gap-4">
                  <Button variant="outline" onClick={clearFilters}>Clear All</Button>
                  <Button onClick={() => setIsMobileFiltersOpen(false)}>Apply Filters</Button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Product Grid */}
        <div className="flex-grow min-h-[500px]">
          {/* Active filter pills */}
          {activeFilterCount > 0 && (
            <div className="hidden md:flex flex-wrap gap-2 mb-6">
              {Object.entries(filters).map(([key, value]) => {
                if (!value || key === 'sort' || key === 'keyword') return null;
                return (
                  <span key={key} className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium border border-emerald-100">
                    {value}
                    <button onClick={() => updateFilter(key, '')} className="ml-2 focus:outline-none">
                      <X className="w-3.5 h-3.5 hover:text-emerald-900" />
                    </button>
                  </span>
                );
              })}
              <button onClick={clearFilters} className="text-sm text-gray-500 hover:text-gray-700 font-medium px-2 underline underline-offset-2">
                Clear All
              </button>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10">
              {Array.from({ length: 12 }).map((_, n) => (
                <CardSkeleton key={n} />
              ))}
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-3xl shadow-sm border border-gray-100 h-full flex flex-col justify-center items-center">
              <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mb-4">
                <Search className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">No items found</h3>
              <p className="mt-2 text-gray-500 max-w-md mx-auto">We couldn't find any items matching your current filters. Try adjusting your search criteria.</p>
              <Button 
                className="mt-8 shadow-md"
                onClick={clearFilters}
              >
                Clear All Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10">
              {listings.map((listing, index) => (
                <ProductCard key={listing._id} listing={listing} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Browse;
