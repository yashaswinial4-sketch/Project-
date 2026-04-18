import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  type: { type: String, required: true, enum: ['cleanser', 'serum', 'moisturizer', 'sunscreen', 'toner', 'mask', 'other'] },
  ingredients: { type: String, required: true },
  suitableSkinTypes: { type: [String], enum: ['dry', 'oily', 'combination', 'sensitive'] },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Product', productSchema);
