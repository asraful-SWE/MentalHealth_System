const express = require('express');
const router = express.Router();
const predictionController = require('./prediction.controller');
const { protect } = require('../../middlewares/authMiddleware');

router.post('/', protect, predictionController.predict);
router.get('/results', protect, predictionController.getResults);
router.get('/latest', protect, predictionController.getLatestResult);

module.exports = router;
