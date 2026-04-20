// Admin dashboard page logic
document.addEventListener('DOMContentLoaded', async () => {
  requireAdmin();
  updateNavbar();
  await loadAdminStats();
});

async function loadAdminStats() {
  try {
    const res = await API.get('/admin/stats', { headers: authHeaders() });
    const stats = res.data.data;

    // Update stat cards
    document.getElementById('statUsers').textContent = stats.totalUsers || 0;
    document.getElementById('statAssessments').textContent = stats.totalAssessments || 0;

    // Risk counts
    const riskMap = renderRiskPieChart(stats.riskDistribution || []);
    document.getElementById('statHighRisk').textContent = riskMap?.High || 0;
    document.getElementById('statLowRisk').textContent = riskMap?.Low || 0;

    // Stress trend chart
    renderStressTrendAdminChart(stats.stressTrends || []);

    // Assessment frequency chart
    renderAssessmentFreqChart(stats.weeklyTrends || []);

    // Monthly trends chart
    renderMonthlyTrendsChart(stats.monthlyTrends || []);
  } catch (error) {
    console.error('Admin stats error:', error);
    if (error.response?.status === 403) {
      alert('Admin access required');
      window.location.href = 'login.html';
    }
  }
}

async function downloadReport(type, format) {
  try {
    const response = await API.get(`/admin/reports?type=${type}&format=${format}`, {
      headers: authHeaders(),
      responseType: 'blob',
    });

    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mental_health_report_${type}.${format}`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  } catch (error) {
    console.error('Report download error:', error);
    alert('Failed to download report');
  }
}
