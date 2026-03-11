const predictionService = require('./prediction.service');
const assessmentService = require('../assessment/assessment.service');

exports.predict = async (req, res, next) => {
  try {
    const { assessmentId } = req.body;

    if (!assessmentId) {
      return res.status(400).json({ success: false, message: 'assessmentId is required' });
    }

    const assessment = await assessmentService.getById(assessmentId);

    // Verify the assessment belongs to the user
    if (assessment.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const result = await predictionService.predict(assessmentId, req.user.id, assessment);
    res.status(200).json({
      success: true,
      message: 'Prediction completed',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

exports.getResults = async (req, res, next) => {
  try {
    const results = await predictionService.getResults(req.user.id);
    res.status(200).json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
};

exports.getLatestResult = async (req, res, next) => {
  try {
    const result = await predictionService.getLatestResult(req.user.id);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};
