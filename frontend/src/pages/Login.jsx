import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { motion } from 'framer-motion';
import { RefreshCw, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center space-x-2 text-emerald-600 mb-8">
              <RefreshCw className="h-8 w-8" />
              <span className="text-2xl font-black tracking-tighter">SwapStyle</span>
            </div>
            
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Sign in to continue your sustainable fashion journey.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-8"
          >
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 border border-red-100 font-medium">
                {error}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <Input
                label="Email address"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="py-3"
              />
              
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                   <label className="text-sm font-medium text-gray-700">Password</label>
                   <a href="#" className="text-sm font-semibold text-emerald-600 hover:text-emerald-500">
                     Forgot password?
                   </a>
                </div>
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="py-3"
                />
              </div>

              <Button type="submit" className="w-full h-14 text-lg shadow-lg shadow-emerald-500/30" isLoading={loading}>
                Sign in <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </form>

            <div className="mt-8 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  New to SwapStyle?
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link to="/register" className="font-bold text-emerald-600 hover:text-emerald-500 transition-colors">
                Create an account
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Right side - Image */}
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 h-full w-full bg-emerald-900 object-cover">
           <img
            className="absolute inset-0 h-full w-full object-cover mix-blend-overlay opacity-80"
            src="https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1035&q=80"
            alt="Fashion clothing rack"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          
          <div className="absolute bottom-12 left-12 right-12 text-white">
            <h3 className="text-4xl font-bold mb-4 leading-tight">Refresh your wardrobe, <br/>protect the planet.</h3>
            <p className="text-lg text-gray-300">Join a community of 50,000+ fashion lovers trading pre-loved items instead of buying new.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
