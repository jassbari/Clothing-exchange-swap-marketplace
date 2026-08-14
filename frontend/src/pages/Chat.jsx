import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import io from 'socket.io-client';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Send, Image as ImageIcon, MoreVertical, Phone, Video, Info, Check, CheckCheck } from 'lucide-react';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import { motion, AnimatePresence } from 'framer-motion';

const ENDPOINT = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'import.meta.env.VITE_API_URL';
var socket, selectedChatCompare;

const Chat = () => {
  const { swapId } = useParams();
  const { user } = useAuth();
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socketConnected, setSocketConnected] = useState(false);
  const [swapDetails, setSwapDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const fetchMessages = async () => {
    if (!swapId) return;
    try {
      const { data } = await api.get(`/chats/${swapId}`);
      setMessages(data || []);
      socket.emit('join chat', swapId);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSwapDetails = async () => {
    try {
       const { data } = await api.get('/swaps');
       const currentSwap = data.find(s => s._id === swapId);
       setSwapDetails(currentSwap);
    } catch (error) {
       console.error(error);
    } finally {
       setLoading(false);
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit('setup', user);
    socket.on('connected', () => setSocketConnected(true));
    socket.on('typing', () => setIsOtherTyping(true));
    socket.on('stop typing', () => setIsOtherTyping(false));

    return () => {
      socket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    fetchSwapDetails();
    fetchMessages();
    selectedChatCompare = swapId;
    // eslint-disable-next-line
  }, [swapId]);

  useEffect(() => {
    socket.on('message received', (newMessageReceived) => {
      if (!selectedChatCompare || selectedChatCompare !== newMessageReceived.swapRequest) {
        // give notification
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!isTyping) {
      setIsTyping(true);
      socket.emit('typing', swapId);
    }

    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && isTyping) {
        socket.emit('stop typing', swapId);
        setIsTyping(false);
      }
    }, timerLength);
  };

  const sendMessage = async (e) => {
    if ((e.key === 'Enter' || e.type === 'submit') && newMessage.trim()) {
      e.preventDefault();
      socket.emit('stop typing', swapId);
      setIsTyping(false);
      
      const currentMessage = newMessage;
      setNewMessage('');
      
      try {
        // Direct socket emit for instant feel
        const msgToSend = {
          swapRequest: swapId,
          sender: user,
          text: currentMessage,
          createdAt: new Date().toISOString()
        };
        
        socket.emit('new message', msgToSend);
        setMessages(prev => [...prev, msgToSend]);
        
        // Background sync to db
        await api.post('/chats', {
          text: currentMessage,
          swapRequestId: swapId,
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOtherTyping]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-emerald-200 border-t-emerald-600"></div>
      </div>
    );
  }

  const otherUser = swapDetails?.sender?._id === user._id ? swapDetails?.receiver : swapDetails?.sender;
  const isOnline = socketConnected; // Simulating online status

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-4 pb-0 md:pt-8 flex justify-center">
      <div className="w-full max-w-5xl md:px-6 h-[calc(100vh-64px)] md:h-[calc(100vh-120px)] flex bg-white md:rounded-3xl shadow-soft border border-gray-100 overflow-hidden">
        
        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-[#efeae2] relative z-10 w-full">
          {/* Chat Background Pattern */}
          <div className="absolute inset-0 z-0 opacity-[0.06] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          
          {/* Header */}
          <div className="px-4 py-3 bg-white backdrop-blur-md border-b border-gray-100 flex items-center justify-between z-20 shadow-sm relative">
            <div className="flex items-center space-x-4 cursor-pointer">
              <div className="relative">
                <Avatar src={otherUser?.profilePicture} alt={otherUser?.name || '?'} size="md" />
                {isOnline && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>}
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900 leading-tight">{otherUser?.name || 'User'}</h2>
                <p className="text-xs text-emerald-600 font-medium">
                  {isOtherTyping ? 'typing...' : (isOnline ? 'Online' : 'Offline')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-gray-500">
              <button className="hover:text-emerald-600 transition-colors hidden sm:block"><Phone className="w-5 h-5" /></button>
              <button className="hover:text-emerald-600 transition-colors hidden sm:block"><Video className="w-5 h-5" /></button>
              <button className="hover:text-emerald-600 transition-colors"><MoreVertical className="w-5 h-5" /></button>
            </div>
          </div>
          
          {/* Item Context Banner */}
          {swapDetails && (
            <div className="bg-white backdrop-blur-md border-b border-gray-200 px-4 py-2 flex items-center justify-between z-20 shadow-sm relative">
              <div className="flex items-center text-xs font-medium text-gray-700">
                <span className="text-gray-500 mr-2">Negotiating:</span>
                <span className="font-bold text-gray-900">{swapDetails.offeredListing?.title || 'Item'}</span>
                <span className="mx-2 text-gray-400">&harr;</span>
                <span className="font-bold text-gray-900">{swapDetails.requestedListing?.title || 'Item'}</span>
              </div>
              <Badge variant={swapDetails.status === 'Pending' ? 'warning' : 'success'}>
                {swapDetails.status}
              </Badge>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 z-10 relative">
            
            <div className="flex justify-center mb-6">
              <span className="bg-white backdrop-blur-sm text-gray-500 text-[11px] font-bold px-3 py-1 rounded-lg shadow-sm border border-gray-100 uppercase tracking-wider">
                Today
              </span>
            </div>
            
            <AnimatePresence>
              {messages.map((m, i) => {
                const isMe = m.sender._id === user._id;
                
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={i} 
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] md:max-w-[65%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      <div 
                        className={`relative px-4 pt-2 pb-3 rounded-2xl shadow-sm text-sm ${
                          isMe 
                            ? 'bg-emerald-500 text-white rounded-br-sm' 
                            : 'bg-white text-gray-900 rounded-bl-sm border border-gray-100'
                        }`}
                      >
                        <span className="break-words leading-relaxed">{m.text}</span>
                        <div className={`flex items-center justify-end space-x-1 mt-1 ${isMe ? 'text-emerald-200' : 'text-gray-400'}`}>
                          <span className="text-[10px] font-medium leading-none">{formatTime(m.createdAt || new Date())}</span>
                          {isMe && <CheckCheck className="w-3 h-3 text-blue-200" />}
                        </div>
                        
                        {/* Chat Tail */}
                        <div className={`absolute top-0 w-4 h-4 ${isMe ? '-right-2 bg-emerald-500' : '-left-2 bg-white'} hidden`} style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%)', transform: isMe ? 'scaleX(-1)' : 'none' }}></div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              
              {isOtherTyping && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex justify-start"
                >
                  <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm border border-gray-100 w-16">
                    <div className="flex space-x-1 mt-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="bg-gray-100 p-3 flex items-center z-20 relative border-t border-gray-200">
            <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
              <ImageIcon className="w-6 h-6" />
            </button>
            <form className="flex-1 flex mx-2" onSubmit={sendMessage}>
              <input 
                type="text"
                value={newMessage}
                onChange={typingHandler}
                onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(e); }}
                placeholder="Type a message"
                className="w-full px-5 py-3 bg-white border-0 rounded-full focus:outline-none focus:ring-0 text-sm shadow-sm"
              />
            </form>
            <button 
              onClick={sendMessage}
              className={`p-3 rounded-full flex items-center justify-center transition-all ${
                newMessage.trim() ? 'bg-emerald-500 text-white shadow-md transform hover:scale-105' : 'bg-transparent text-gray-400 pointer-events-none'
              }`}
            >
               <Send className="w-5 h-5 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
