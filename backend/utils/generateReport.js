const reportService = require('../app/services/reportService');

/**
 * Utility wrapper for generating reports.
 * Can be used independently or via the admin service.
 */
exports.generateWeeklyReport = async (format = 'pdf') => {
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const reportData = {
    type: 'weekly',
    period: { start: weekAgo, end: now },
    totalAssessments: 0,
    riskDistribution: { Low: 0, Moderate: 0, High: 0 },
    avgStress: 0,
    avgSleep: 0,
  };

  if (format === 'csv') {
    return reportService.generateCSV(reportData, []);
  }
  return reportService.generatePDF(reportData);
};

exports.generateMonthlyReport = async (format = 'pdf') => {
  const now = new Date();
  const monthAgo = new Date(now);
  monthAgo.setMonth(monthAgo.getMonth() - 1);

  const reportData = {
    type: 'monthly',
    period: { start: monthAgo, end: now },
    totalAssessments: 0,
    riskDistribution: { Low: 0, Moderate: 0, High: 0 },
    avgStress: 0,
    avgSleep: 0,
  };

  if (format === 'csv') {
    return reportService.generateCSV(reportData, []);
  }
  return reportService.generatePDF(reportData);
};
