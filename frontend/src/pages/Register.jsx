import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { motion } from 'framer-motion';
import { RefreshCw, ArrowRight } from 'lucide-react';
import api from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth(); // We'll login after register
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      
      // Auto login after registration
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 overflow-y-auto">
        <div className="mx-auto w-full max-w-sm lg:w-96 my-auto">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center space-x-2 text-emerald-600 mb-6">
              <RefreshCw className="h-8 w-8" />
              <span className="text-2xl font-black tracking-tighter">SwapStyle</span>
            </div>
            
            <h2 className="text-3xl font-extrabold text-gray-900">
              Create an account
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Join thousands of sustainable fashion lovers today.
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

            <form className="space-y-5" onSubmit={handleSubmit}>
              
              <Input
                label="Full Name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Jane Doe"
                className="py-3"
              />

              <Input
                label="Email address"
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="py-3"
              />
              
              <Input
                label="Password"
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="py-3"
              />
              
              <Button type="submit" className="w-full h-14 text-lg shadow-lg shadow-emerald-500/30 mt-2" isLoading={loading}>
                Sign up <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </form>

            <div className="mt-8 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6 text-center pb-8">
              <Link to="/login" className="font-bold text-emerald-600 hover:text-emerald-500 transition-colors">
                Sign in instead
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Right side - Image */}
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 h-full w-full bg-blue-900 object-cover overflow-hidden">
           <img
            className="absolute inset-0 h-full w-full object-cover mix-blend-overlay opacity-80"
            src="https://images.unsplash.com/photo-1489987707023-af0825ae1eeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1035&q=80"
            alt="People sharing clothes"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
          
          <div className="absolute bottom-12 left-12 right-12 text-white">
            <h3 className="text-4xl font-bold mb-4 leading-tight">Your wardrobe is <br/>your currency.</h3>
            <p className="text-lg text-gray-300">Start trading your pre-loved clothes today. No money required, just fair swaps.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
