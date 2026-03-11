const Result = require('./prediction.model');
const gptService = require('../../services/gptService');
const emailService = require('../../services/emailService');
const User = require('../auth/auth.model');

exports.predict = async (assessmentId, userId, assessmentData) => {
  // Call GPT for analysis
  const gptResult = await gptService.analyzeAssessment(assessmentData);

  // Save result
  const result = await Result.create({
    assessmentId,
    userId,
    riskLevel: gptResult.risk_level,
    recommendations: gptResult.recommendations,
  });

  // If high risk, send email alert
  if (gptResult.risk_level === 'High') {
    try {
      const user = await User.findById(userId);
      if (user && user.email) {
        await emailService.sendHighRiskAlert(user.email, user.name, gptResult.recommendations);
      }
    } catch (emailError) {
      console.error('Email alert failed:', emailError.message);
    }
  }

  return result;
};

exports.getResults = async (userId) => {
  const results = await Result.find({ userId })
    .populate('assessmentId')
    .sort({ createdAt: -1 })
    .lean();
  return results;
};

exports.getLatestResult = async (userId) => {
  const result = await Result.findOne({ userId })
    .populate('assessmentId')
    .sort({ createdAt: -1 })
    .lean();
  return result;
};
