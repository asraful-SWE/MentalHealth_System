const express = require('express');
const router = express.Router();
const assessmentController = require('./assessment.controller');
const { protect } = require('../../middlewares/authMiddleware');

router.post('/', protect, assessmentController.create);
router.get('/history', protect, assessmentController.getHistory);

module.exports = router;
