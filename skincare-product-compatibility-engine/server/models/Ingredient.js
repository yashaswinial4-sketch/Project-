import mongoose from 'mongoose';

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  conflictsWith: {
    type: [String],
    default: []
  },
  safeFor: {
    type: [String],
    enum: ['dry', 'oily', 'combination', 'sensitive'],
    default: []
  },
  unsafeFor: {
    type: [String],
    enum: ['dry', 'oily', 'combination', 'sensitive'],
    default: []
  },
  category: {
    type: String,
    default: ''
  },
  benefits: {
    type: [String],
    default: []
  },
  strength: {
    type: String,
    enum: ['gentle', 'medium', 'strong', 'irritant'],
    default: 'gentle'
  }
});

export default mongoose.model('Ingredient', ingredientSchema);
