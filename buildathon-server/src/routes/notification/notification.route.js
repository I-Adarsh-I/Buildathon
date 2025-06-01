const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const isAuthenticated = require('../../middlewares/isAuthenticated');

router.get('/', isAuthenticated, notificationController.getNotifications);
router.put('/:id/read', isAuthenticated, notificationController.markNotificationAsRead);
router.put('/mark-all-read', isAuthenticated, notificationController.markAllNotificationsAsRead);
router.delete('/:id', isAuthenticated, notificationController.deleteNotification);

module.exports = router;