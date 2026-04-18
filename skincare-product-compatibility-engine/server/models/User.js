import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  skinType: {
    type: String,
    enum: ['dry', 'oily', 'combination', 'sensitive'],
    default: 'oily'
  },
  concerns: {
    type: [String],
    default: []
  },
  products: [{
    name: String,
    type: String,
    ingredients: String
  }],
  analysisHistory: [{
    date: { type: Date, default: Date.now },
    score: Number,
    warnings: Number,
    conflicts: Number
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('User', userSchema);
