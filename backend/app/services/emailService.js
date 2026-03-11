const nodemailer = require('nodemailer');
const { EMAIL_USER, EMAIL_PASS } = require('../../config/env');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

/**
 * Sends a high-risk alert email to the student with mental health resources.
 */
exports.sendHighRiskAlert = async (toEmail, studentName, recommendations) => {
  const recsList = recommendations.map((r) => `<li>${r}</li>`).join('');

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 20px; border-radius: 10px 10px 0 0;">
        <h2 style="margin: 0;">🧠 Mental Health Check-in</h2>
        <p style="margin: 5px 0 0 0; opacity: 0.9;">Important Wellness Update</p>
      </div>
      <div style="background: #f9fafb; padding: 25px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
        <p>Dear ${studentName || 'Student'},</p>
        <p>Our recent mental health assessment has identified that you may be experiencing elevated stress levels. 
           <strong>Your well-being matters to us</strong>, and we want to ensure you have access to the support you need.</p>
        
        <h3 style="color: #7c3aed;">📋 Personalized Recommendations:</h3>
        <ul style="line-height: 1.8;">${recsList}</ul>
        
        <h3 style="color: #7c3aed;">🆘 Helpful Resources:</h3>
        <ul style="line-height: 1.8;">
          <li><strong>988 Suicide & Crisis Lifeline:</strong> Call or text <strong>988</strong></li>
          <li><strong>Crisis Text Line:</strong> Text HOME to <strong>741741</strong></li>
          <li><strong>NAMI Helpline:</strong> 1-800-950-NAMI (6264)</li>
          <li><strong>Your campus counseling center</strong> — reach out and schedule a session</li>
        </ul>
        
        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 0 5px 5px 0;">
          <p style="margin: 0;"><strong>Remember:</strong> Seeking help is a sign of strength, not weakness. 
          You are not alone, and support is available.</p>
        </div>
        
        <p style="color: #6b7280; font-size: 12px; margin-top: 20px;">
          This is an automated message from the Mental Health Assessment System. 
          This is not a diagnosis. Please consult a qualified mental health professional for personalized advice.
        </p>
      </div>
    </div>
  `;

  const mailOptions = {
    from: `"Mental Health Support" <${EMAIL_USER}>`,
    to: toEmail,
    subject: '🧠 Important: Your Mental Health Assessment Results',
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
  console.log(`📧 High-risk alert email sent to ${toEmail}`);
};
