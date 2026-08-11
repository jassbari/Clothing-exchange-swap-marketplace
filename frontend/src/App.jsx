import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Browse from './pages/Browse';
import ItemDetails from './pages/ItemDetails';
import CreateListing from './pages/CreateListing';
import Dashboard from './pages/Dashboard';
import SwapRequest from './pages/SwapRequest';
import Chat from './pages/Chat';
import HowItWorks from './pages/HowItWorks';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans transition-colors duration-300 ease-in-out">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/listings/:id" element={<ItemDetails />} />
          <Route 
            path="/create-listing" 
            element={
              <ProtectedRoute>
                <CreateListing />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/swap-request/:listingId" 
            element={
              <ProtectedRoute>
                <SwapRequest />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/chat/:swapId" 
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
