const PDFDocument = require('pdfkit');
const { Parser } = require('json2csv');

/**
 * Generate a PDF report from report data.
 * Returns a PDFDocument stream.
 */
exports.generatePDF = (reportData) => {
  const doc = new PDFDocument({ margin: 50 });

  // Title
  doc.fontSize(22).fillColor('#4f46e5').text('Mental Health Assessment Report', { align: 'center' });
  doc.moveDown(0.5);

  // Report type & period
  doc.fontSize(12).fillColor('#6b7280')
    .text(`Report Type: ${reportData.type.charAt(0).toUpperCase() + reportData.type.slice(1)}`, { align: 'center' });
  doc.text(
    `Period: ${new Date(reportData.period.start).toLocaleDateString()} - ${new Date(reportData.period.end).toLocaleDateString()}`,
    { align: 'center' }
  );
  doc.moveDown(1.5);

  // Divider
  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke('#e5e7eb');
  doc.moveDown(1);

  // Summary Section
  doc.fontSize(16).fillColor('#1f2937').text('Summary', { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(12).fillColor('#374151');
  doc.text(`Total Assessments: ${reportData.totalAssessments}`);
  doc.text(`Average Stress Level: ${reportData.avgStress}/10`);
  doc.text(`Average Sleep Hours: ${reportData.avgSleep} hrs`);
  doc.moveDown(1);

  // Risk Distribution
  doc.fontSize(16).fillColor('#1f2937').text('Risk Distribution', { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(12).fillColor('#374151');

  const colors = { Low: '#10b981', Moderate: '#f59e0b', High: '#ef4444' };
  for (const [level, count] of Object.entries(reportData.riskDistribution)) {
    doc.fillColor(colors[level] || '#374151').text(`  ${level} Risk: ${count} assessments`);
  }
  doc.moveDown(1);

  // Footer
  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke('#e5e7eb');
  doc.moveDown(0.5);
  doc.fontSize(9).fillColor('#9ca3af')
    .text(`Generated on ${new Date().toLocaleString()} | Mental Health Risk Assessment System`, { align: 'center' });
  doc.text('This report contains anonymized aggregate data only.', { align: 'center' });

  return doc;
};

/**
 * Generate a CSV report from assessment data.
 * Returns CSV string.
 */
exports.generateCSV = (reportData, assessments) => {
  const csvData = assessments.map((a, index) => ({
    'S.No': index + 1,
    Date: new Date(a.createdAt).toLocaleDateString(),
    'Sleep Hours': a.sleepHours,
    'Stress Level': a.stressLevel,
    'Screen Time': a.screenTime,
    'Study Load': a.studyLoad,
    'Social Activity': a.socialActivity,
    Mood: a.mood,
    Energy: a.energy,
    Motivation: a.motivation,
    Isolation: a.isolation,
    Concentration: a.concentration,
    'Academic Pressure': a.academicPressure,
    'Physical Activity': a.physicalActivity,
  }));

  if (csvData.length === 0) {
    // Return a summary-only CSV
    const summaryData = [
      {
        'Report Type': reportData.type,
        'Period Start': new Date(reportData.period.start).toLocaleDateString(),
        'Period End': new Date(reportData.period.end).toLocaleDateString(),
        'Total Assessments': reportData.totalAssessments,
        'Avg Stress': reportData.avgStress,
        'Avg Sleep': reportData.avgSleep,
        'Low Risk': reportData.riskDistribution.Low || 0,
        'Moderate Risk': reportData.riskDistribution.Moderate || 0,
        'High Risk': reportData.riskDistribution.High || 0,
      },
    ];
    const parser = new Parser();
    return parser.parse(summaryData);
  }

  const parser = new Parser();
  return parser.parse(csvData);
};
