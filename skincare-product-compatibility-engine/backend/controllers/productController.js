import { sampleProducts } from '../logic/skincareRules.js';
import Product from '../models/Product.js';

export const getProducts = async (req, res) => {
  try {
    const dbProducts = await Product.find({}).lean();
    if (dbProducts.length > 0) {
      return res.status(200).json({ success: true, data: dbProducts, source: 'database' });
    }
    return res.status(200).json({ success: true, data: sampleProducts, source: 'sample' });
  } catch (error) {
    console.error('Get products error:', error);
    return res.status(200).json({ success: true, data: sampleProducts, source: 'sample', note: 'Database unavailable, returning sample data' });
  }
};
