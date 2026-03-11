const express = require('express');
const router = express.Router();
const adminController = require('./admin.controller');
const { protect } = require('../../middlewares/authMiddleware');
const { adminOnly } = require('../../middlewares/adminMiddleware');

router.get('/stats', protect, adminOnly, adminController.getStats);
router.get('/reports', protect, adminOnly, adminController.getReport);

module.exports = router;
