import { Router } from 'express';
import { getProducts } from '../controllers/productController.js';

const router = Router();

// GET /api/products — Get sample/reference products
router.get('/', getProducts);

export default router;
