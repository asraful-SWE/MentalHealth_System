const adminService = require('./admin.service');

exports.getStats = async (req, res, next) => {
  try {
    const stats = await adminService.getStats();
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

exports.getReport = async (req, res, next) => {
  try {
    const { type = 'weekly', format = 'pdf' } = req.query;

    if (!['weekly', 'monthly'].includes(type)) {
      return res.status(400).json({ success: false, message: 'Type must be weekly or monthly' });
    }
    if (!['pdf', 'csv'].includes(format)) {
      return res.status(400).json({ success: false, message: 'Format must be pdf or csv' });
    }

    const report = await adminService.generateReport(type, format);

    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=report_${type}.csv`);
      return res.send(report);
    } else {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=report_${type}.pdf`);
      report.pipe(res);
      return report.end();
    }
  } catch (error) {
    next(error);
  }
};
