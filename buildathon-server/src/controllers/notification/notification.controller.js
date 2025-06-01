const Notification = require('../../models/notification.models');

exports.getNotifications = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { read, page = 1, limit = 10 } = req.query;

        let filter = { recipient: userId };
        if (read === 'true') filter.read = true;
        if (read === 'false') filter.read = false;

        const notifications = await Notification.find(filter)
            .sort({ createdAt: -1 }) // Newest first
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .populate('sender', 'name profilePhoto');

        const totalNotifications = await Notification.countDocuments(filter);

        res.status(200).json({
            success: true,
            notifications,
            totalPages: Math.ceil(totalNotifications / limit),
            currentPage: parseInt(page),
            totalResults: totalNotifications
        });
    } catch (error) {
        next(error);
    }
};

// Mark a specific notification as read
exports.markNotificationAsRead = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const notification = await Notification.findOneAndUpdate(
            { _id: id, recipient: userId, read: false },
            { read: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found or already read.' });
        }

        res.status(200).json({
            success: true,
            message: 'Notification marked as read.',
            notification
        });
    } catch (error) {
        next(error);
    }
};

// Mark all notifications for the user as read
exports.markAllNotificationsAsRead = async (req, res, next) => {
    try {
        const userId = req.user._id;

        await Notification.updateMany(
            { recipient: userId, read: false },
            { read: true }
        );

        res.status(200).json({
            success: true,
            message: 'All notifications marked as read.'
        });
    } catch (error) {
        next(error);
    }
};

// Delete a specific notification
exports.deleteNotification = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const notification = await Notification.findOneAndDelete({ _id: id, recipient: userId });

        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found.' });
        }

        res.status(200).json({
            success: true,
            message: 'Notification deleted successfully.'
        });
    } catch (error) {
        next(error);
    }
};