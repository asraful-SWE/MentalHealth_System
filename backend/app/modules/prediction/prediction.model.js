const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema(
  {
    assessmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assessment',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    riskLevel: {
      type: String,
      enum: ['Low', 'Moderate', 'High'],
      required: true,
    },
    recommendations: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Result', resultSchema);
