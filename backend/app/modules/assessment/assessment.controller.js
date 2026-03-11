const assessmentService = require('./assessment.service');

exports.create = async (req, res, next) => {
  try {
    const requiredFields = [
      'sleepHours', 'stressLevel', 'screenTime', 'studyLoad',
      'socialActivity', 'mood', 'energy', 'motivation',
      'isolation', 'concentration', 'academicPressure',
      'physicalActivity', 'emotionalStability',
    ];

    for (const field of requiredFields) {
      if (req.body[field] === undefined || req.body[field] === null) {
        return res.status(400).json({ success: false, message: `${field} is required` });
      }
    }

    const assessment = await assessmentService.createAssessment(req.user.id, req.body);
    res.status(201).json({
      success: true,
      message: 'Assessment submitted successfully',
      data: assessment,
    });
  } catch (error) {
    next(error);
  }
};

exports.getHistory = async (req, res, next) => {
  try {
    const assessments = await assessmentService.getHistory(req.user.id);
    res.status(200).json({ success: true, data: assessments });
  } catch (error) {
    next(error);
  }
};
