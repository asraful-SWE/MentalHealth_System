const Assessment = require('../assessment/assessment.model');
const Result = require('../prediction/prediction.model');
const User = require('../auth/auth.model');
const reportService = require('../../services/reportService');

exports.getStats = async () => {
  const totalUsers = await User.countDocuments({ role: 'student' });
  const totalAssessments = await Assessment.countDocuments();

  // Risk distribution
  const riskDistribution = await Result.aggregate([
    { $group: { _id: '$riskLevel', count: { $sum: 1 } } },
  ]);

  // Stress trends (last 30 days, grouped by day)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const stressTrends = await Assessment.aggregate([
    { $match: { createdAt: { $gte: thirtyDaysAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        avgStress: { $avg: '$stressLevel' },
        avgSleep: { $avg: '$sleepHours' },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Weekly assessment counts
  const weeklyTrends = await Assessment.aggregate([
    { $match: { createdAt: { $gte: thirtyDaysAgo } } },
    {
      $group: {
        _id: { $isoWeek: '$createdAt' },
        count: { $sum: 1 },
        avgStress: { $avg: '$stressLevel' },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Monthly trends (last 12 months)
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

  const monthlyTrends = await Assessment.aggregate([
    { $match: { createdAt: { $gte: twelveMonthsAgo } } },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        count: { $sum: 1 },
        avgStress: { $avg: '$stressLevel' },
        avgSleep: { $avg: '$sleepHours' },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  return {
    totalUsers,
    totalAssessments,
    riskDistribution,
    stressTrends,
    weeklyTrends,
    monthlyTrends,
  };
};

exports.generateReport = async (type, format) => {
  const now = new Date();
  let startDate;

  if (type === 'weekly') {
    startDate = new Date(now);
    startDate.setDate(startDate.getDate() - 7);
  } else {
    startDate = new Date(now);
    startDate.setMonth(startDate.getMonth() - 1);
  }

  const assessments = await Assessment.find({
    createdAt: { $gte: startDate },
  }).lean();

  const results = await Result.find({
    createdAt: { $gte: startDate },
  }).lean();

  const riskCounts = { Low: 0, Moderate: 0, High: 0 };
  results.forEach((r) => {
    if (riskCounts[r.riskLevel] !== undefined) riskCounts[r.riskLevel]++;
  });

  const reportData = {
    type,
    period: { start: startDate, end: now },
    totalAssessments: assessments.length,
    riskDistribution: riskCounts,
    avgStress:
      assessments.length > 0
        ? (assessments.reduce((s, a) => s + a.stressLevel, 0) / assessments.length).toFixed(2)
        : 0,
    avgSleep:
      assessments.length > 0
        ? (assessments.reduce((s, a) => s + a.sleepHours, 0) / assessments.length).toFixed(2)
        : 0,
  };

  if (format === 'csv') {
    return reportService.generateCSV(reportData, assessments);
  } else {
    return reportService.generatePDF(reportData);
  }
};
