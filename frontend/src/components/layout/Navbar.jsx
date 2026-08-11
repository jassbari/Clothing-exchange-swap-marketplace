import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LogOut, 
  User, 
  Menu, 
  X, 
  Search,
  Plus
} from 'lucide-react';
import Button from '../ui/Button';
import Avatar from '../ui/Avatar';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    // Implementation for search, typically navigating to /browse with a query param
    navigate('/browse');
  };

  return (
    <nav 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-soft border-b border-gray-100' : 'bg-white/80 backdrop-blur-md border-b border-gray-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          
          {/* Logo & Search */}
          <div className="flex items-center flex-1">
            <Link to="/" className="flex-shrink-0 flex items-center mr-8">
              <span className="text-2xl font-extrabold tracking-tight text-emerald-500">
                SwapStyle
              </span>
            </Link>
            
            <div className="hidden md:block flex-1 max-w-xl">
              <form onSubmit={handleSearch} className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-2xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all duration-200 sm:text-sm"
                  placeholder="Search for items, brands, or styles..."
                />
              </form>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/browse" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors">Browse</Link>
            
            {user ? (
              <div className="flex items-center space-x-5">
                {/* Icons */}


                <Link to="/create-listing">
                  <Button size="sm" className="rounded-full pl-3 pr-4 shadow-sm hover:shadow-md">
                    <Plus className="w-4 h-4 mr-1.5" /> Sell Item
                  </Button>
                </Link>

                <div className="relative group">
                  <button className="flex items-center space-x-2 focus:outline-none">
                    <Avatar src={user.profilePicture} alt={user.name} size="sm" />
                  </button>
                  <div className="absolute right-0 w-56 mt-3 bg-white rounded-2xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100 mb-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <Link to="/dashboard" className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-emerald-600 transition-colors">
                      <User className="w-4 h-4 mr-3" /> Profile & Dashboard
                    </Link>
                    <button onClick={logout} className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                      <LogOut className="w-4 h-4 mr-3" /> Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors">Sign In</Link>
                <Link to="/register">
                  <Button size="sm">Join Now</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <Link to="/search" className="text-gray-500 hover:text-emerald-500">
              <Search className="h-6 w-6" />
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-500 hover:text-gray-900 focus:outline-none transition-colors">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu panel */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 border-b border-gray-100 shadow-soft bg-white' : 'max-h-0'}`}>
        <div className="px-4 pt-2 pb-6 space-y-1">
          <Link to="/browse" className="block px-3 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 transition-colors">Browse Marketplace</Link>
          {user ? (
            <>
              <Link to="/create-listing" className="block px-3 py-3 rounded-xl text-base font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition-colors">
                <span className="flex items-center"><Plus className="w-4 h-4 mr-2" /> Sell an Item</span>
              </Link>

              <div className="border-t border-gray-100 mt-2 pt-2">
                <Link to="/dashboard" className="block px-3 py-3 rounded-xl text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors">Profile & Dashboard</Link>
                <button onClick={logout} className="block w-full text-left px-3 py-3 rounded-xl text-base font-medium text-red-600 hover:bg-red-50 transition-colors">Sign Out</button>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-4 mt-4">
              <Link to="/login">
                <Button variant="outline" className="w-full">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button className="w-full">Join Now</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
