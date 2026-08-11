import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, X, Tag, DollarSign, List, Ruler, Shirt } from 'lucide-react';

const CreateListing = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    category: '',
    size: '',
    color: '',
    gender: '',
    material: '',
    condition: '',
    description: '',
    estimatedValue: '',
  });
  
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  
  const MAX_IMAGES = 5;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const processFiles = (files) => {
    if (files.length + images.length > MAX_IMAGES) {
      return setError(`You can only upload up to ${MAX_IMAGES} images.`);
    }
    setError('');
    
    // Filter out non-images just in case
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    
    setImages(prev => [...prev, ...validFiles]);

    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    processFiles(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    const newPreviews = [...imagePreviews];
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) {
      return setError('Please upload at least one photo of your item.');
    }
    
    setLoading(true);
    setError('');

    const submitData = new FormData();
    Object.keys(formData).forEach((key) => {
      submitData.append(key, formData[key]);
    });
    images.forEach((image) => {
      submitData.append('images', image);
    });

    try {
      const { data } = await api.post('/listings', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate(`/listings/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };
  
  // Calculate completion percentage
  const calculateProgress = () => {
    const requiredFields = ['title', 'brand', 'category', 'size', 'condition', 'description', 'estimatedValue'];
    let filled = 0;
    requiredFields.forEach(field => {
      if (formData[field] && formData[field].trim() !== '') filled++;
    });
    if (images.length > 0) filled++;
    
    return Math.round((filled / (requiredFields.length + 1)) * 100);
  };
  
  const progress = calculateProgress();

  return (
    <div className="bg-gray-50 min-h-screen py-10 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">List an Item</h1>
          <p className="mt-2 text-gray-500">Provide details about the clothing you want to swap.</p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-gray-700">Listing Completeness</span>
            <span className="text-sm font-bold text-emerald-600">{progress}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="bg-emerald-500 h-2.5 rounded-full"
            ></motion.div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-start">
              <X className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Photo Upload Section */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                Photos <span className="ml-2 text-sm font-normal text-gray-500">({images.length}/{MAX_IMAGES})</span>
              </h2>
              <p className="text-sm text-gray-500 mt-1">Upload clear, well-lit photos showing all angles and tags.</p>
            </div>

            <div 
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 ${
                isDragging ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 hover:border-gray-400 bg-gray-50'
              } ${images.length >= MAX_IMAGES ? 'hidden' : 'block'}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadCloud className={`w-12 h-12 mx-auto mb-4 ${isDragging ? 'text-emerald-500' : 'text-gray-400'}`} />
              <h3 className="text-lg font-bold text-gray-900">Drag & drop photos here</h3>
              <p className="text-sm text-gray-500 mt-1 mb-6">or click to browse from your device</p>
              <Button type="button" variant="outline" className="pointer-events-none bg-white">Select Photos</Button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                multiple 
                accept="image/*" 
                onChange={handleImageChange} 
              />
            </div>

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-bold text-gray-700 mb-3">Uploaded Photos</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  <AnimatePresence>
                    {imagePreviews.map((preview, index) => (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        key={index} 
                        className="relative aspect-[3/4] rounded-xl overflow-hidden border border-gray-200 group bg-gray-100 shadow-sm"
                      >
                        <img src={preview} alt={`Upload ${index}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button 
                            type="button"
                            onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                            className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-transform hover:scale-110 shadow-lg"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        {index === 0 && (
                          <div className="absolute top-2 left-2 bg-white backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold text-gray-800 shadow-sm">
                            COVER
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Item Details</h2>
              <p className="text-sm text-gray-500 mb-6">Describe your item accurately to attract the right swappers.</p>
            </div>

            <Input 
              label="Title" 
              name="title" 
              required 
              value={formData.title} 
              onChange={handleChange} 
              placeholder="e.g., Vintage Nike Embroidered Hoodie" 
              className="text-lg"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label="Brand" 
                name="brand" 
                required 
                value={formData.brand} 
                onChange={handleChange} 
                placeholder="e.g., Nike" 
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <div className="relative">
                  <select 
                    name="category" 
                    required 
                    value={formData.category} 
                    onChange={handleChange} 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all duration-200 text-gray-900 font-medium appearance-none"
                  >
                    <option value="">Select Category</option>
                    <option value="Tops">Tops</option>
                    <option value="Bottoms">Bottoms</option>
                    <option value="Dresses">Dresses</option>
                    <option value="Outerwear">Outerwear</option>
                    <option value="Shoes">Shoes</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input 
                label="Size" 
                name="size" 
                required 
                value={formData.size} 
                onChange={handleChange} 
                placeholder="e.g., Medium (M)" 
              />
              <Input 
                label="Color" 
                name="color" 
                required 
                value={formData.color} 
                onChange={handleChange} 
                placeholder="e.g., Navy Blue" 
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                <div className="relative">
                  <select 
                    name="condition" 
                    required 
                    value={formData.condition} 
                    onChange={handleChange} 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all duration-200 text-gray-900 font-medium appearance-none"
                  >
                    <option value="">Select Condition</option>
                    <option value="New">New / With Tags</option>
                    <option value="Like New">Like New</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender Focus</label>
                <div className="relative">
                  <select 
                    name="gender" 
                    required 
                    value={formData.gender} 
                    onChange={handleChange} 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all duration-200 text-gray-900 font-medium appearance-none"
                  >
                    <option value="">Select Gender</option>
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Unisex">Unisex</option>
                  </select>
                </div>
              </div>
              
              <Input 
                label="Material" 
                name="material" 
                value={formData.material} 
                onChange={handleChange} 
                placeholder="e.g., 100% Cotton" 
              />
            </div>
          </div>

          {/* Description & Value */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <textarea 
                name="description" 
                required 
                value={formData.description} 
                onChange={handleChange} 
                rows="5"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all duration-200 text-gray-900 font-medium resize-none"
                placeholder="Share the story behind this item. Mention any flaws, how it fits, and why you're swapping it..."
              ></textarea>
            </div>
             
            <div className="w-full md:w-1/2">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Estimated Value (₹)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  min="0"
                  name="estimatedValue"
                  required
                  value={formData.estimatedValue}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all duration-200 text-gray-900 font-bold text-lg"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">Set a fair estimated value to ensure you get equitable swap offers.</p>
            </div>
          </div>

          <div className="flex justify-end pt-4">
             <Button type="button" variant="ghost" className="mr-4" onClick={() => navigate(-1)}>
               Cancel
             </Button>
             <Button type="submit" size="lg" isLoading={loading} className="px-10">
               Publish Listing
             </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateListing;
