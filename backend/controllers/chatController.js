import ChatMessage from '../models/ChatMessage.js';

// @desc    Get chat messages for a swap request
// @route   GET /api/chats/:swapRequestId
// @access  Private
const getChatMessages = async (req, res) => {
  try {
    const messages = await ChatMessage.find({ swapRequest: req.params.swapRequestId })
      .populate('sender', 'name profilePicture')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getChatMessages };
