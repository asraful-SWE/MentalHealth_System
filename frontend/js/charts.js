// Chart rendering utilities using Chart.js

function renderStressTrendChart(history) {
  const ctx = document.getElementById('stressTrendChart');
  if (!ctx) return;

  const recent = history.slice(0, 15).reverse();
  const labels = recent.map((a) => new Date(a.createdAt).toLocaleDateString());
  const stressData = recent.map((a) => a.stressLevel);

  new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Stress Level',
          data: stressData,
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#ef4444',
          pointRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true, position: 'top' },
      },
      scales: {
        y: { beginAtZero: true, max: 10, title: { display: true, text: 'Level' } },
        x: { title: { display: true, text: 'Date' } },
      },
    },
  });
}

function renderSleepStressChart(history) {
  const ctx = document.getElementById('sleepStressChart');
  if (!ctx) return;

  const recent = history.slice(0, 15).reverse();
  const labels = recent.map((a) => new Date(a.createdAt).toLocaleDateString());

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Sleep (hrs)',
          data: recent.map((a) => a.sleepHours),
          backgroundColor: 'rgba(16, 185, 129, 0.7)',
          borderColor: '#10b981',
          borderWidth: 1,
        },
        {
          label: 'Stress Level',
          data: recent.map((a) => a.stressLevel),
          backgroundColor: 'rgba(239, 68, 68, 0.7)',
          borderColor: '#ef4444',
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true, position: 'top' },
      },
      scales: {
        y: { beginAtZero: true, title: { display: true, text: 'Value' } },
        x: { title: { display: true, text: 'Date' } },
      },
    },
  });
}

// Admin charts
function renderRiskPieChart(riskDistribution) {
  const ctx = document.getElementById('riskPieChart');
  if (!ctx) return;

  const riskMap = { Low: 0, Moderate: 0, High: 0 };
  riskDistribution.forEach((r) => {
    if (riskMap[r._id] !== undefined) riskMap[r._id] = r.count;
  });

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Low Risk', 'Moderate Risk', 'High Risk'],
      datasets: [
        {
          data: [riskMap.Low, riskMap.Moderate, riskMap.High],
          backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
          borderWidth: 2,
          borderColor: '#fff',
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' },
      },
    },
  });

  return riskMap;
}

function renderStressTrendAdminChart(stressTrends) {
  const ctx = document.getElementById('stressTrendAdminChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: stressTrends.map((t) => t._id),
      datasets: [
        {
          label: 'Avg Stress',
          data: stressTrends.map((t) => t.avgStress?.toFixed(1)),
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          fill: true,
          tension: 0.4,
          borderWidth: 2,
        },
        {
          label: 'Avg Sleep',
          data: stressTrends.map((t) => t.avgSleep?.toFixed(1)),
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true,
          tension: 0.4,
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'top' } },
      scales: {
        y: { beginAtZero: true, title: { display: true, text: 'Level' } },
      },
    },
  });
}

function renderAssessmentFreqChart(weeklyTrends) {
  const ctx = document.getElementById('assessmentFreqChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: weeklyTrends.map((w) => `Week ${w._id}`),
      datasets: [
        {
          label: 'Assessments',
          data: weeklyTrends.map((w) => w.count),
          backgroundColor: 'rgba(102, 126, 234, 0.7)',
          borderColor: '#667eea',
          borderWidth: 1,
          borderRadius: 8,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, title: { display: true, text: 'Count' } },
      },
    },
  });
}

function renderMonthlyTrendsChart(monthlyTrends) {
  const ctx = document.getElementById('monthlyTrendsChart');
  if (!ctx) return;

  const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: monthlyTrends.map((m) => `${months[m._id.month]} ${m._id.year}`),
      datasets: [
        {
          label: 'Assessments',
          data: monthlyTrends.map((m) => m.count),
          borderColor: '#764ba2',
          backgroundColor: 'rgba(118, 75, 162, 0.1)',
          fill: true,
          tension: 0.4,
          borderWidth: 2,
        },
        {
          label: 'Avg Stress',
          data: monthlyTrends.map((m) => m.avgStress?.toFixed(1)),
          borderColor: '#ef4444',
          borderWidth: 2,
          tension: 0.4,
          pointStyle: 'triangle',
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'top' } },
      scales: {
        y: { beginAtZero: true },
      },
    },
  });
}
