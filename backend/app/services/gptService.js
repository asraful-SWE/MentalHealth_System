const { OPENAI_API_KEY } = require('../../config/env');

/**
 * Analyzes student assessment data using OpenAI GPT API
 * and returns risk level + recommendations.
 */
exports.analyzeAssessment = async (assessmentData) => {
  const prompt = `You are a mental health risk analysis assistant.
Analyze the student's responses and classify the risk level as:
- Low Risk
- Moderate Risk  
- High Risk

Also generate helpful well-being suggestions.

Student Data:
Sleep Hours: ${assessmentData.sleepHours}
Stress Level: ${assessmentData.stressLevel}/10
Screen Time: ${assessmentData.screenTime} hours
Study Load: ${assessmentData.studyLoad}/10
Social Activity: ${assessmentData.socialActivity}/10
Mood: ${assessmentData.mood}/10
Energy Level: ${assessmentData.energy}/10
Motivation: ${assessmentData.motivation}/10
Isolation Level: ${assessmentData.isolation}/10
Concentration: ${assessmentData.concentration}/10
Academic Pressure: ${assessmentData.academicPressure}/10
Physical Activity: ${assessmentData.physicalActivity}/10
Emotional Stability: ${assessmentData.emotionalStability}/10

Return strictly in JSON format:
{
  "risk_level": "Low" | "Moderate" | "High",
  "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3", "recommendation 4", "recommendation 5"]
}

Important: Return ONLY the JSON object, no extra text.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a mental health risk analysis assistant. Always respond with valid JSON only.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.3,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('OpenAI API error:', response.status, errorBody);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content.trim();

    // Parse the JSON response
    const parsed = JSON.parse(content);

    // Normalize risk level
    let riskLevel = parsed.risk_level || 'Moderate';
    if (riskLevel.toLowerCase().includes('low')) riskLevel = 'Low';
    else if (riskLevel.toLowerCase().includes('high')) riskLevel = 'High';
    else riskLevel = 'Moderate';

    return {
      risk_level: riskLevel,
      recommendations: parsed.recommendations || [
        'Maintain a balanced lifestyle',
        'Seek support if needed',
        'Practice regular self-care',
      ],
    };
  } catch (error) {
    console.error('GPT Service Error:', error.message);

    // Fallback: basic rule-based risk assessment
    return fallbackAnalysis(assessmentData);
  }
};

/**
 * Fallback rule-based analysis when GPT API is unavailable
 */
function fallbackAnalysis(data) {
  let riskScore = 0;

  // Higher stress = higher risk
  riskScore += data.stressLevel * 2;
  // Lower sleep = higher risk
  riskScore += (10 - Math.min(data.sleepHours, 10)) * 1.5;
  // Higher screen time = higher risk
  riskScore += Math.min(data.screenTime, 10) * 0.5;
  // Higher study load = higher risk
  riskScore += data.studyLoad * 1;
  // Lower social activity = higher risk
  riskScore += (10 - data.socialActivity) * 1;
  // Lower mood = higher risk
  riskScore += (10 - data.mood) * 1.5;
  // Lower energy = higher risk
  riskScore += (10 - data.energy) * 1;
  // Lower motivation = higher risk
  riskScore += (10 - data.motivation) * 1;
  // Higher isolation = higher risk
  riskScore += data.isolation * 1.5;
  // Lower concentration = higher risk
  riskScore += (10 - data.concentration) * 1;
  // Higher academic pressure = higher risk
  riskScore += data.academicPressure * 1;
  // Lower physical activity = higher risk
  riskScore += (10 - data.physicalActivity) * 0.5;
  // Lower emotional stability = higher risk
  riskScore += (10 - (data.emotionalStability || 5)) * 1.5;

  const maxScore = 145;
  const percentage = (riskScore / maxScore) * 100;

  let risk_level, recommendations;

  if (percentage < 35) {
    risk_level = 'Low';
    recommendations = [
      'Great job maintaining a healthy lifestyle!',
      'Continue your current sleep and exercise habits.',
      'Stay connected with friends and family.',
      'Keep up your positive study-life balance.',
      'Consider mindfulness practices to maintain well-being.',
    ];
  } else if (percentage < 65) {
    risk_level = 'Moderate';
    recommendations = [
      'Try to improve your sleep schedule — aim for 7-9 hours.',
      'Consider stress management techniques like deep breathing or meditation.',
      'Reduce screen time, especially before bed.',
      'Engage in regular physical activity — even a 20-minute walk helps.',
      'Talk to a trusted friend, family member, or counselor about your stress.',
    ];
  } else {
    risk_level = 'High';
    recommendations = [
      'Please reach out to a mental health professional or campus counselor.',
      'Prioritize sleep and establish a consistent bedtime routine.',
      'Practice daily relaxation techniques — meditation, yoga, or journaling.',
      'Limit academic overload — consider discussing workload with an advisor.',
      'Stay connected socially — isolation worsens mental health. Reach out to someone you trust.',
      'If you feel overwhelmed, contact a helpline: 988 Suicide & Crisis Lifeline (call/text 988).',
    ];
  }

  return { risk_level, recommendations };
}
