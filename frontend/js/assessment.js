// Assessment page logic
document.addEventListener('DOMContentLoaded', () => {
  requireAuth();
  updateNavbar();
  initSliders();
});

function initSliders() {
  const sliders = [
    'sleepHours', 'stressLevel', 'screenTime', 'studyLoad',
    'socialActivity', 'mood', 'energy', 'motivation',
    'isolation', 'concentration', 'academicPressure',
    'physicalActivity', 'emotionalStability',
  ];

  sliders.forEach((id) => {
    const slider = document.getElementById(id);
    const display = document.getElementById(id + 'Val');
    if (slider && display) {
      slider.addEventListener('input', () => {
        display.textContent = slider.value;
      });
    }
  });
}

document.getElementById('assessmentForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = document.getElementById('submitBtn');
  const alertEl = document.getElementById('assessmentAlert');

  const data = {
    sleepHours: parseFloat(document.getElementById('sleepHours').value),
    stressLevel: parseInt(document.getElementById('stressLevel').value),
    screenTime: parseFloat(document.getElementById('screenTime').value),
    studyLoad: parseInt(document.getElementById('studyLoad').value),
    socialActivity: parseInt(document.getElementById('socialActivity').value),
    mood: parseInt(document.getElementById('mood').value),
    energy: parseInt(document.getElementById('energy').value),
    motivation: parseInt(document.getElementById('motivation').value),
    isolation: parseInt(document.getElementById('isolation').value),
    concentration: parseInt(document.getElementById('concentration').value),
    academicPressure: parseInt(document.getElementById('academicPressure').value),
    physicalActivity: parseInt(document.getElementById('physicalActivity').value),
    emotionalStability: parseInt(document.getElementById('emotionalStability').value),
  };

  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Submitting & Analyzing...';
  alertEl.classList.add('d-none');

  try {
    // Step 1: Submit assessment
    const assessmentRes = await API.post('/assessment', data, { headers: authHeaders() });
    const assessmentId = assessmentRes.data.data._id;

    // Step 2: Get prediction
    const predictionRes = await API.post('/predict', { assessmentId }, { headers: authHeaders() });

    alertEl.className = 'alert alert-success';
    alertEl.innerHTML = `<i class="fas fa-check-circle me-2"></i>Assessment submitted successfully! Risk Level: <strong>${predictionRes.data.data.riskLevel}</strong>. Redirecting to results...`;
    alertEl.classList.remove('d-none');

    setTimeout(() => {
      window.location.href = 'results.html';
    }, 1500);
  } catch (err) {
    alertEl.className = 'alert alert-danger';
    alertEl.textContent = err.response?.data?.message || 'Failed to submit assessment';
    alertEl.classList.remove('d-none');
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-paper-plane me-2"></i>Submit Assessment';
  }
});
