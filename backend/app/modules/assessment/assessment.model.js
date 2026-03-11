const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sleepHours: {
      type: Number,
      required: true,
      min: 0,
      max: 24,
    },
    stressLevel: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    screenTime: {
      type: Number,
      required: true,
      min: 0,
      max: 24,
    },
    studyLoad: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    socialActivity: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    mood: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    energy: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    motivation: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    isolation: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    concentration: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    academicPressure: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    physicalActivity: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    emotionalStability: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Assessment', assessmentSchema);
