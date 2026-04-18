import React from 'react';
import type { Product } from '../types';
import { Plus, Trash2, Droplet, AlertTriangle } from 'lucide-react';

interface Props {
  products: Product[];
  onChange: (products: Product[]) => void;
}

const acneProneIngredients = [
  'coconut oil', 'cocoa butter', 'isopropyl myristate', 'lanolin',
  'mineral oil', 'fragrance', 'alcohol denat', 'sodium lauryl sulfate',
  'dimethicone', 'butyl stearate', 'wheat germ oil', 'laureth-4',
];

const AcneProductReview: React.FC<Props> = ({ products, onChange }) => {
  const addProduct = () => {
    onChange([...products, { id: Date.now().toString(), name: '', type: 'cleanser', ingredients: '' }]);
  };

  const removeProduct = (id: string) => {
    onChange(products.filter(p => p.id !== id));
  };

  const updateProduct = (id: string, field: keyof Product, value: string) => {
    onChange(products.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const getAcneWarnings = (ingredients: string): string[] => {
    if (!ingredients) return [];
    const ings = ingredients.toLowerCase();
    return acneProneIngredients.filter(ai => ings.includes(ai));
  };

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
            <AlertTriangle size={20} className="text-amber-600" />
          </div>
          <div>
            <h4 className="font-bold text-amber-800 mb-1">Acne-Triggering Ingredients</h4>
            <p className="text-sm text-amber-700">
              We'll flag products containing ingredients known to clog pores or trigger breakouts.
              Be as specific as possible with ingredient lists.
            </p>
          </div>
        </div>
      </div>

      {/* Product List */}
      {products.map((product, index) => {
        const warnings = getAcneWarnings(product.ingredients);
        return (
          <div
            key={product.id}
            className={`bg-white rounded-2xl border-2 p-5 transition-all duration-300 ${
              warnings.length > 0 ? 'border-red-200 bg-red-50/30' : 'border-gray-100'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-rose-100 rounded-lg flex items-center justify-center text-rose-600 font-bold text-sm">
                  {index + 1}
                </div>
                <span className="font-bold text-gray-800">Product #{index + 1}</span>
              </div>
              {products.length > 1 && (
                <button
                  onClick={() => removeProduct(product.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                  Product Name
                </label>
                <input
                  type="text"
                  value={product.name}
                  onChange={e => updateProduct(product.id, 'name', e.target.value)}
                  placeholder="e.g., CeraVe Foaming Cleanser"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                  Product Type
                </label>
                <select
                  value={product.type}
                  onChange={e => updateProduct(product.id, 'type', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition-all text-sm bg-white"
                >
                  <option value="cleanser">Cleanser</option>
                  <option value="toner">Toner</option>
                  <option value="serum">Serum</option>
                  <option value="moisturizer">Moisturizer</option>
                  <option value="sunscreen">Sunscreen</option>
                  <option value="mask">Mask</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                Ingredients (comma separated)
              </label>
              <textarea
                value={product.ingredients}
                onChange={e => updateProduct(product.id, 'ingredients', e.target.value)}
                placeholder="e.g., water, salicylic acid, glycerin, hyaluronic acid"
                rows={3}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition-all text-sm resize-none"
              />
            </div>

            {/* Warnings */}
            {warnings.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {warnings.map((w, wi) => (
                  <span
                    key={wi}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold"
                  >
                    <Droplet size={12} />
                    {w}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Add Button */}
      <button
        onClick={addProduct}
        className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-gray-300 rounded-2xl text-gray-500 hover:border-rose-400 hover:text-rose-500 hover:bg-rose-50 transition-all duration-300"
      >
        <Plus size={20} />
        Add Another Product
      </button>
    </div>
  );
};

export default AcneProductReview;
