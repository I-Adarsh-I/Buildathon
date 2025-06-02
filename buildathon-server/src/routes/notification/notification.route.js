const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const isAuthenticated = require('../../middlewares/isAuthenticated');

router.get('/', notificationController.getNotifications);
router.put('/:id/read', notificationController.markNotificationAsRead);
router.put('/mark-all-read', notificationController.markAllNotificationsAsRead);
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;
// isAuthenticated,
// isAuthenticated,
// isAuthenticated,
// isAuthenticated,