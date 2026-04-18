import React, { useState } from 'react';
import type { Product, ProductType } from '../types';
import { Plus, Trash2, AlertCircle } from 'lucide-react';

interface ProductInputListProps {
  products: Product[];
  onProductsChange: (products: Product[]) => void;
}

const productTypes: { value: ProductType; label: string; emoji: string }[] = [
  { value: 'cleanser', label: 'Cleanser', emoji: '🧼' },
  { value: 'toner', label: 'Toner', emoji: '💦' },
  { value: 'serum', label: 'Serum', emoji: '💉' },
  { value: 'moisturizer', label: 'Moisturizer', emoji: '🧴' },
  { value: 'sunscreen', label: 'Sunscreen', emoji: '☀️' },
  { value: 'mask', label: 'Mask', emoji: '🎭' },
  { value: 'other', label: 'Other', emoji: '📦' },
];

const commonIngredients = [
  'retinol', 'vitamin c', 'salicylic acid', 'glycolic acid', 'lactic acid',
  'benzoyl peroxide', 'niacinamide', 'hyaluronic acid', 'ceramides',
  'fragrance', 'alcohol', 'alcohol denat', 'tea tree oil', 'squalane',
  'shea butter', 'aloe vera', 'centella asiatica', 'zinc', 'panthenol',
  'glycerin', 'vitamin e', 'green tea', 'clay', 'charcoal', 'coconut oil',
  'jojoba oil', 'mineral oil'
];

const ProductInputList: React.FC<ProductInputListProps> = ({ products, onProductsChange }) => {
  const [showIngredientHints, setShowIngredientHints] = useState<string | null>(null);

  const addProduct = () => {
    onProductsChange([
      ...products,
      { id: Date.now().toString(), name: '', type: 'cleanser', ingredients: '' }
    ]);
  };

  const removeProduct = (id: string) => {
    onProductsChange(products.filter(p => p.id !== id));
  };

  const updateProduct = (id: string, field: keyof Product, value: string) => {
    onProductsChange(products.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const addIngredient = (productId: string, ingredient: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    const current = product.ingredients.trim();
    const newIngredients = current ? `${current}, ${ingredient}` : ingredient;
    updateProduct(productId, 'ingredients', newIngredients);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <span className="text-2xl">📋</span> Your Current Products
        </h3>
        <button
          onClick={addProduct}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors font-medium shadow-md"
        >
          <Plus size={18} /> Add Product
        </button>
      </div>

      {products.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <div className="text-4xl mb-3">🧴</div>
          <p className="text-gray-500 text-lg">No products added yet</p>
          <p className="text-gray-400 text-sm mt-1">Add the products you currently use in your skincare routine</p>
          <button
            onClick={addProduct}
            className="mt-4 px-6 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors font-medium"
          >
            + Add Your First Product
          </button>
        </div>
      )}

      {products.map((product, index) => (
        <div key={product.id} className="bg-white rounded-2xl border-2 border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-sm">
                {index + 1}
              </span>
              <span className="font-semibold text-gray-700">Product #{index + 1}</span>
            </div>
            <button
              onClick={() => removeProduct(product.id)}
              className="text-red-400 hover:text-red-600 transition-colors p-1"
              title="Remove product"
            >
              <Trash2 size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Product Name *</label>
              <input
                type="text"
                value={product.name}
                onChange={e => updateProduct(product.id, 'name', e.target.value)}
                placeholder="e.g., CeraVe Cleanser"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
              />
            </div>

            {/* Product Type */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Product Type *</label>
              <select
                value={product.type}
                onChange={e => updateProduct(product.id, 'type', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all bg-white"
              >
                {productTypes.map(pt => (
                  <option key={pt.value} value={pt.value}>{pt.emoji} {pt.label}</option>
                ))}
              </select>
            </div>

            {/* Ingredients */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Ingredients *
                <button
                  onClick={() => setShowIngredientHints(showIngredientHints === product.id ? null : product.id)}
                  className="ml-2 text-emerald-500 hover:text-emerald-700"
                  title="Show common ingredients"
                >
                  <AlertCircle size={14} className="inline" />
                </button>
              </label>
              <input
                type="text"
                value={product.ingredients}
                onChange={e => updateProduct(product.id, 'ingredients', e.target.value)}
                placeholder="e.g., salicylic acid, glycerin, aloe vera"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
              />
              {/* Ingredient hints dropdown */}
              {showIngredientHints === product.id && (
                <div className="absolute z-10 mt-2 w-full bg-white border-2 border-gray-200 rounded-xl shadow-xl p-3 max-h-48 overflow-y-auto">
                  <p className="text-xs text-gray-400 mb-2 font-medium">Click to add:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {commonIngredients.map(ing => (
                      <button
                        key={ing}
                        onClick={() => { addIngredient(product.id, ing); setShowIngredientHints(null); }}
                        className="px-2 py-1 text-xs bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors"
                      >
                        + {ing}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <p className="text-xs text-gray-400 mt-3">
            💡 Enter ingredients as comma-separated values. Click the <AlertCircle size={12} className="inline" /> icon for common ingredients.
          </p>
        </div>
      ))}
    </div>
  );
};

export default ProductInputList;
