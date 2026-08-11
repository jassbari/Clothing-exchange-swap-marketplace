import Notification from '../models/Notification.js';

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (notification) {
      if (notification.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized');
      }

      notification.read = true;
      await notification.save();
      res.json(notification);
    } else {
      res.status(404);
      throw new Error('Notification not found');
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export { getNotifications, markAsRead };
