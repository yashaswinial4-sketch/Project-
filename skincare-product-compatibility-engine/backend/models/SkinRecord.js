import mongoose from 'mongoose';

const skinRecordSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  date: { type: Date, default: Date.now },
  skinType: { type: String, enum: ['dry', 'oily', 'combination', 'sensitive'], required: true },
  imageUrl: { type: String, default: '' },
  imageMetrics: {
    brightness: { type: Number, default: 0 },
    redness: { type: Number, default: 0 },
    saturation: { type: Number, default: 0 },
    uniformity: { type: Number, default: 0 },
    oiliness: { type: Number, default: 0 },
    dryness: { type: Number, default: 0 },
  },
  analysisResult: { type: mongoose.Schema.Types.Mixed },
  acneRisk: { type: mongoose.Schema.Types.Mixed },
  lifestyleData: {
    sleepHours: { type: Number, default: 7 },
    waterIntake: { type: Number, default: 8 },
    dietQuality: { type: String, enum: ['poor', 'average', 'good', 'excellent'], default: 'average' },
    stressLevel: { type: String, enum: ['low', 'moderate', 'high'], default: 'moderate' },
    exerciseDays: { type: Number, default: 3 },
    alcoholConsumption: { type: String, default: 'none' },
    smokingStatus: { type: String, default: 'non-smoker' },
    screenTime: { type: Number, default: 6 },
  },
  notes: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('SkinRecord', skinRecordSchema);
