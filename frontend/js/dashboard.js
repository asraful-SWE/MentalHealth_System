// Dashboard page logic
let historyById = {};
let resultByAssessmentId = {};

document.addEventListener('DOMContentLoaded', async () => {
  requireAuth();
  updateNavbar();

  const user = getUser();
  if (user) {
    document.getElementById('welcomeText').textContent = `Welcome back, ${user.name}!`;
  }

  await loadDashboardData();
  initChatbot();
  initHistoryDetails();
});

async function loadDashboardData() {
  try {
    // Load results and assessment history in parallel
    const [resultsRes, historyRes] = await Promise.all([
      API.get('/predict/results', { headers: authHeaders() }),
      API.get('/assessment/history', { headers: authHeaders() }),
    ]);

    const results = resultsRes.data.data || [];
    const history = historyRes.data.data || [];

    // Total assessments
    document.getElementById('totalAssessments').textContent = history.length;

    // Latest result
    if (results.length > 0) {
      const latest = results[0];
      renderRiskBadge(latest.riskLevel);
      document.getElementById('lastAssessmentDate').textContent =
        `Last: ${new Date(latest.createdAt).toLocaleDateString()}`;

      // Recommendations
      if (latest.recommendations && latest.recommendations.length > 0) {
        document.getElementById('recommendationsCard').style.display = 'block';
        document.getElementById('recommendationsList').innerHTML = latest.recommendations
          .map(
            (r, i) => `
          <div class="d-flex align-items-start mb-2">
            <span class="badge rounded-circle me-3 mt-1 flex-shrink-0" 
                  style="width:24px; height:24px; line-height:24px; background:linear-gradient(135deg,#667eea,#764ba2); font-size:11px;">${i + 1}</span>
            <p class="mb-0 small">${r}</p>
          </div>`
          )
          .join('');
      }
    }

    // Last stress
    if (history.length > 0) {
      document.getElementById('lastStress').textContent = history[0].stressLevel;
    }

    // Render history table
    renderHistoryTable(history, results);

    // Render charts
    renderStressTrendChart(history);
    renderSleepStressChart(history);
  } catch (error) {
    console.error('Dashboard load error:', error);
  }
}

function renderRiskBadge(level) {
  const colors = { Low: '#10b981', Moderate: '#f59e0b', High: '#ef4444' };
  const icons = { Low: 'check-circle', Moderate: 'exclamation-circle', High: 'exclamation-triangle' };
  const color = colors[level] || '#6b7280';
  const icon = icons[level] || 'question-circle';

  document.getElementById('riskBadge').innerHTML = `
    <div>
      <i class="fas fa-${icon} mb-2" style="font-size: 2.5rem; color: ${color};"></i>
      <div><span class="badge fs-6 px-3 py-2 rounded-pill text-white" style="background:${color};">${level} Risk</span></div>
    </div>`;
}

function renderHistoryTable(history, results) {
  const body = document.getElementById('historyBody');
  historyById = history.reduce((acc, item) => {
    acc[item._id] = item;
    return acc;
  }, {});
  resultByAssessmentId = results.reduce((acc, item) => {
    const aid = item.assessmentId?._id || item.assessmentId;
    if (aid) {
      acc[aid] = item;
    }
    return acc;
  }, {});

  if (history.length === 0) {
    body.innerHTML = '<tr><td colspan="7" class="text-center text-muted py-4">No assessments yet</td></tr>';
    return;
  }

  // Map results by assessmentId
  const riskMap = {};
  results.forEach((r) => {
    const aid = r.assessmentId?._id || r.assessmentId;
    riskMap[aid] = r.riskLevel;
  });

  body.innerHTML = history
    .slice(0, 20)
    .map(
      (a, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${new Date(a.createdAt).toLocaleDateString()}</td>
      <td><span class="badge bg-${a.stressLevel >= 7 ? 'danger' : a.stressLevel >= 4 ? 'warning' : 'success'}">${a.stressLevel}/10</span></td>
      <td>${a.sleepHours} hrs</td>
      <td>${a.mood}/10</td>
      <td>${getRiskBadgeSmall(riskMap[a._id])}</td>
      <td>
        <button class="btn btn-sm btn-outline-primary rounded-pill" data-action="view-history" data-assessment-id="${a._id}">
          <i class="fas fa-eye me-1"></i>View
        </button>
      </td>
    </tr>`
    )
    .join('');
}

function initHistoryDetails() {
  const historyBody = document.getElementById('historyBody');
  if (!historyBody) return;

  historyBody.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-action="view-history"]');
    if (!btn) return;

    const assessmentId = btn.getAttribute('data-assessment-id');
    const assessment = historyById[assessmentId];
    if (!assessment) return;

    const result = resultByAssessmentId[assessmentId] || null;
    showAssessmentDetails(assessment, result);
  });
}

function showAssessmentDetails(assessment, result) {
  const body = document.getElementById('assessmentDetailBody');
  if (!body) return;

  const detailRows = [
    ['Date', new Date(assessment.createdAt).toLocaleString()],
    ['Sleep Hours', `${assessment.sleepHours} hrs`],
    ['Stress Level', `${assessment.stressLevel}/10`],
    ['Screen Time', `${assessment.screenTime} hrs`],
    ['Study Load', `${assessment.studyLoad}/10`],
    ['Social Activity', `${assessment.socialActivity}/10`],
    ['Mood', `${assessment.mood}/10`],
    ['Energy', `${assessment.energy}/10`],
    ['Motivation', `${assessment.motivation}/10`],
    ['Isolation', `${assessment.isolation}/10`],
    ['Concentration', `${assessment.concentration}/10`],
    ['Academic Pressure', `${assessment.academicPressure}/10`],
    ['Physical Activity', `${assessment.physicalActivity}/10`],
    ['Emotional Stability', `${assessment.emotionalStability}/10`],
  ];

  const riskBadge = result
    ? `<span class="badge bg-${
        result.riskLevel === 'High' ? 'danger' : result.riskLevel === 'Moderate' ? 'warning text-dark' : 'success'
      }">${result.riskLevel}</span>`
    : '<span class="text-muted">Not generated yet</span>';

  const recommendationsHtml = result?.recommendations?.length
    ? `<ul class="mb-0 ps-3">${result.recommendations
        .map((item) => `<li class="mb-1">${item}</li>`)
        .join('')}</ul>`
    : '<span class="text-muted">No recommendations available</span>';

  body.innerHTML = `
    <div class="mb-3 p-3 rounded-3" style="background: #f8fafc; border: 1px solid #e5e7eb;">
      <h6 class="fw-bold mb-2"><i class="fas fa-robot me-2"></i>System Result</h6>
      <div class="mb-2"><strong>Risk Level:</strong> ${riskBadge}</div>
      <div><strong>Recommendations:</strong> ${recommendationsHtml}</div>
    </div>

    <div class="table-responsive">
      <table class="table table-sm align-middle mb-0">
        <tbody>
          ${detailRows
            .map(
              ([label, value]) => `
            <tr>
              <th class="text-muted" style="width: 40%;">${label}</th>
              <td class="fw-semibold">${value}</td>
            </tr>`
            )
            .join('')}
        </tbody>
      </table>
    </div>
  `;

  const modalEl = document.getElementById('assessmentDetailModal');
  if (!modalEl || !window.bootstrap?.Modal) return;
  const modal = new window.bootstrap.Modal(modalEl);
  modal.show();
}

function getRiskBadgeSmall(level) {
  if (!level) return '<span class="text-muted">—</span>';
  const colors = { Low: 'success', Moderate: 'warning', High: 'danger' };
  return `<span class="badge bg-${colors[level] || 'secondary'}">${level}</span>`;
}

// Chatbot
function initChatbot() {
  const sendBtn = document.getElementById('chatSendBtn');
  const input = document.getElementById('chatInput');

  if (!sendBtn || !input) return;

  const sendMessage = async () => {
    const msg = input.value.trim();
    if (!msg) return;

    appendChatMessage(msg, 'user');
    input.value = '';

    // Simple local responses (no API call needed for basic chatbot)
    const botReply = getChatbotReply(msg);
    setTimeout(() => appendChatMessage(botReply, 'bot'), 500);
  };

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
}

function appendChatMessage(text, sender) {
  const container = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = `mb-2 ${sender === 'user' ? 'text-end' : ''}`;
  div.innerHTML = `<div class="d-inline-block ${
    sender === 'user' ? 'text-white' : 'bg-light'
  } rounded-3 p-2 px-3 small" style="${
    sender === 'user' ? 'background: linear-gradient(135deg, #667eea, #764ba2);' : ''
  } max-width: 80%;">${text}</div>`;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function getChatbotReply(msg) {
  const lower = msg.toLowerCase();

  if (lower.includes('stress') || lower.includes('stressed')) {
    return "Stress is common among students. Try deep breathing exercises, take short breaks, and maintain a regular sleep schedule. Consider talking to a counselor if stress feels overwhelming. 💆";
  }
  if (lower.includes('sleep') || lower.includes('insomnia') || lower.includes('tired')) {
    return "Good sleep hygiene is crucial! Try to: 1) Keep a consistent bedtime 2) Avoid screens 1hr before bed 3) Limit caffeine after 2pm 4) Keep your room dark and cool. Aim for 7-9 hours. 😴";
  }
  if (lower.includes('anxious') || lower.includes('anxiety') || lower.includes('worried')) {
    return "Anxiety can be challenging. Try grounding techniques: 5 things you see, 4 you hear, 3 you touch, 2 you smell, 1 you taste. Regular exercise and mindfulness meditation can also help. 🌿";
  }
  if (lower.includes('sad') || lower.includes('depress') || lower.includes('lonely')) {
    return "I'm sorry you're feeling this way. It's important to reach out to someone — a friend, family member, or professional. You're not alone. Consider calling 988 (Suicide & Crisis Lifeline) if needed. 💙";
  }
  if (lower.includes('exercise') || lower.includes('fitness') || lower.includes('workout')) {
    return "Exercise is one of the best things for mental health! Even a 20-minute walk can boost your mood. Try to get at least 150 minutes of moderate activity per week. 🏃";
  }
  if (lower.includes('study') || lower.includes('academic') || lower.includes('exam')) {
    return "Academic pressure is real! Try the Pomodoro technique (25 min study / 5 min break), break tasks into smaller goals, and don't forget to take breaks. Your mental health comes first! 📚";
  }
  if (lower.includes('help') || lower.includes('resource')) {
    return "Here are some resources: 988 Suicide & Crisis Lifeline (call/text 988), Crisis Text Line (text HOME to 741741), NAMI Helpline (1-800-950-6264). Your campus counseling center is also a great option. 🆘";
  }
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return "Hello! 👋 I'm here to help with mental health tips and well-being advice. What's on your mind?";
  }
  if (lower.includes('thank')) {
    return "You're welcome! Remember, taking care of your mental health is important. I'm always here if you need advice. 😊";
  }
  if (lower.includes('meditation') || lower.includes('mindful')) {
    return "Mindfulness meditation is powerful! Start with just 5 minutes daily. Focus on your breath and let thoughts pass without judgment. Apps like Headspace or Calm can guide you. 🧘";
  }

  return "That's a great question! For personalized mental health support, I'd recommend: 1) Taking our assessment 2) Following the recommendations 3) Reaching out to a campus counselor. Is there anything specific about stress, sleep, or well-being I can help with? 😊";
}
