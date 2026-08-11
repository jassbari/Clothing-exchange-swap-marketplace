import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-blue-500">
              SwapStyle
            </span>
            <p className="mt-4 text-gray-500 max-w-sm">
              The sustainable clothing exchange platform where you can refresh your wardrobe without spending a dime. Swap clothes, save the planet.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Platform</h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="/browse" className="text-base text-gray-500 hover:text-emerald-600:text-emerald-400">Browse Items</Link></li>
              <li><Link to="/how-it-works" className="text-base text-gray-500 hover:text-emerald-600:text-emerald-400">How it Works</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-100 pt-8 text-center">
          <p className="text-base text-gray-400">
            &copy; {new Date().getFullYear()} SwapStyle Marketplace. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
