import React from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Shirt, 
  Search, 
  Handshake, 
  ArrowRight,
  Leaf,
  PiggyBank,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  ChevronDown
} from 'lucide-react';
import Button from '../components/ui/Button';

const HowItWorks = () => {
  return (
    <div className="bg-gray-50 dark:bg-slate-900 min-h-screen py-12 md:py-20 transition-colors duration-300">
      
      {/* 1. Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-slate-50 tracking-tight mb-6">
          How SwapStyle Works
        </h1>
        <p className="mt-4 text-xl text-gray-600 dark:text-slate-300 max-w-2xl mx-auto mb-10">
          Exchange clothes, save money, and promote sustainable fashion in just a few simple steps.
        </p>
        <Link to="/browse">
          <Button size="lg" className="rounded-full shadow-hover px-8 text-lg">
            Start Swapping
          </Button>
        </Link>
      </div>

      {/* 2. Four-Step Process */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0 md:space-x-4 relative">
          {/* Step 1 */}
          <div className="flex-1 flex flex-col items-center text-center group">
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
              <User size={36} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-slate-50 mb-3">Step 1 - Create Your Profile</h3>
            <p className="text-gray-600 dark:text-slate-400 text-sm">Sign up, complete your profile, and become part of the SwapStyle community.</p>
          </div>

          <div className="hidden md:block text-gray-300 dark:text-slate-600">
            <ArrowRight size={32} />
          </div>

          {/* Step 2 */}
          <div className="flex-1 flex flex-col items-center text-center group">
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
              <Shirt size={36} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-slate-50 mb-3">Step 2 - List Your Clothing</h3>
            <p className="text-gray-600 dark:text-slate-400 text-sm">Upload photos, add details like size, condition, category, and describe your item.</p>
          </div>

          <div className="hidden md:block text-gray-300 dark:text-slate-600">
            <ArrowRight size={32} />
          </div>

          {/* Step 3 */}
          <div className="flex-1 flex flex-col items-center text-center group">
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
              <Search size={36} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-slate-50 mb-3">Step 3 - Browse & Request Swaps</h3>
            <p className="text-gray-600 dark:text-slate-400 text-sm">Explore available clothing items and send swap requests to other users.</p>
          </div>

          <div className="hidden md:block text-gray-300 dark:text-slate-600">
            <ArrowRight size={32} />
          </div>

          {/* Step 4 */}
          <div className="flex-1 flex flex-col items-center text-center group">
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
              <Handshake size={36} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-slate-50 mb-3">Step 4 - Complete the Exchange</h3>
            <p className="text-gray-600 dark:text-slate-400 text-sm">Once both users agree, exchange the items and enjoy your refreshed wardrobe.</p>
          </div>
        </div>
      </div>

      {/* 3. Why Choose SwapStyle */}
      <div className="bg-white dark:bg-slate-800 py-20 border-y border-gray-100 dark:border-slate-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-slate-50 tracking-tight">Why Choose SwapStyle</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-8 bg-gray-50 dark:bg-slate-900 rounded-3xl text-center shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-slate-800">
              <Leaf className="w-12 h-12 text-emerald-500 mx-auto mb-6" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-slate-50 mb-3">Eco-Friendly</h3>
              <p className="text-gray-600 dark:text-slate-400">Reduce textile waste and help protect the environment.</p>
            </div>
            <div className="p-8 bg-gray-50 dark:bg-slate-900 rounded-3xl text-center shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-slate-800">
              <PiggyBank className="w-12 h-12 text-emerald-500 mx-auto mb-6" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-slate-50 mb-3">Save Money</h3>
              <p className="text-gray-600 dark:text-slate-400">Refresh your wardrobe without buying new clothes.</p>
            </div>
            <div className="p-8 bg-gray-50 dark:bg-slate-900 rounded-3xl text-center shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-slate-800">
              <Sparkles className="w-12 h-12 text-emerald-500 mx-auto mb-6" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-slate-50 mb-3">Quality Clothing</h3>
              <p className="text-gray-600 dark:text-slate-400">Exchange only good-condition clothing.</p>
            </div>
            <div className="p-8 bg-gray-50 dark:bg-slate-900 rounded-3xl text-center shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-slate-800">
              <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto mb-6" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-slate-50 mb-3">Trusted Community</h3>
              <p className="text-gray-600 dark:text-slate-400">Secure accounts with verified users and transparent listings.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Safety Tips Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/30 rounded-3xl p-8 md:p-12 shadow-sm flex flex-col md:flex-row gap-8 items-start transition-colors duration-300">
          <div className="bg-amber-100 dark:bg-amber-800/40 p-4 rounded-2xl flex-shrink-0">
            <ShieldAlert className="w-10 h-10 text-amber-600 dark:text-amber-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-50 mb-6">Safety Tips</h2>
            <ul className="space-y-4 text-gray-700 dark:text-slate-300">
              <li className="flex items-start">
                <span className="w-2 h-2 rounded-full bg-amber-500 mt-2 mr-3 flex-shrink-0"></span>
                <span>Meet in safe public places.</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 rounded-full bg-amber-500 mt-2 mr-3 flex-shrink-0"></span>
                <span>Verify item condition before exchanging.</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 rounded-full bg-amber-500 mt-2 mr-3 flex-shrink-0"></span>
                <span>Communicate politely with other users.</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 rounded-full bg-amber-500 mt-2 mr-3 flex-shrink-0"></span>
                <span>Report suspicious activity.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 5. Frequently Asked Questions */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-slate-50 text-center mb-12 tracking-tight">Frequently Asked Questions</h2>
        <div className="space-y-6">
          
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 transition-colors duration-300">
            <h4 className="text-lg font-bold text-gray-900 dark:text-slate-50 mb-2 flex items-center">
              <span className="text-emerald-500 mr-2 font-black">Q.</span> Is SwapStyle free?
            </h4>
            <p className="text-gray-600 dark:text-slate-400 pl-7"><span className="font-semibold text-gray-700 dark:text-slate-300">A.</span> Yes. Creating an account and swapping clothes is completely free.</p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 transition-colors duration-300">
            <h4 className="text-lg font-bold text-gray-900 dark:text-slate-50 mb-2 flex items-center">
              <span className="text-emerald-500 mr-2 font-black">Q.</span> Can I exchange instead of selling?
            </h4>
            <p className="text-gray-600 dark:text-slate-400 pl-7"><span className="font-semibold text-gray-700 dark:text-slate-300">A.</span> Yes. The platform is built specifically for clothing exchanges.</p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 transition-colors duration-300">
            <h4 className="text-lg font-bold text-gray-900 dark:text-slate-50 mb-2 flex items-center">
              <span className="text-emerald-500 mr-2 font-black">Q.</span> Can I upload multiple images?
            </h4>
            <p className="text-gray-600 dark:text-slate-400 pl-7"><span className="font-semibold text-gray-700 dark:text-slate-300">A.</span> Yes, every listing can contain multiple images.</p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 transition-colors duration-300">
            <h4 className="text-lg font-bold text-gray-900 dark:text-slate-50 mb-2 flex items-center">
              <span className="text-emerald-500 mr-2 font-black">Q.</span> How do I contact another user?
            </h4>
            <p className="text-gray-600 dark:text-slate-400 pl-7"><span className="font-semibold text-gray-700 dark:text-slate-300">A.</span> Send a swap request through the platform.</p>
          </div>

        </div>
      </div>

      {/* 6. Call To Action */}
      <div className="bg-emerald-600 dark:bg-emerald-800 py-20 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6 tracking-tight">
            Ready to Refresh Your Wardrobe?
          </h2>
          <p className="text-xl text-emerald-100 mb-10">
            Join thousands of users promoting sustainable fashion.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/browse">
              <Button size="lg" className="w-full sm:w-auto bg-white text-emerald-700 hover:bg-emerald-50 border-none shadow-md">
                Browse Items
              </Button>
            </Link>
            <Link to="/create-listing">
              <Button size="lg" className="w-full sm:w-auto bg-emerald-700 dark:bg-emerald-900 text-white hover:bg-emerald-800 dark:hover:bg-emerald-950 border border-emerald-500 dark:border-emerald-700 shadow-md">
                List an Item
              </Button>
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
};

export default HowItWorks;
