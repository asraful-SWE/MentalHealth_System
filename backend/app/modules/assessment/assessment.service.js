const Assessment = require('./assessment.model');

exports.createAssessment = async (userId, data) => {
  const assessment = await Assessment.create({ userId, ...data });
  return assessment;
};

exports.getHistory = async (userId) => {
  const assessments = await Assessment.find({ userId })
    .sort({ createdAt: -1 })
    .lean();
  return assessments;
};

exports.getById = async (id) => {
  const assessment = await Assessment.findById(id).lean();
  if (!assessment) {
    throw { status: 404, message: 'Assessment not found' };
  }
  return assessment;
};
