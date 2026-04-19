// ─────────────────────────────────────────────────────────────
// PRODUCT CARD COMPONENT (TASK 6)
// Displays a recommended product with price, rating, alternatives
// ─────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import type { RecommendedProduct, BudgetAlternative } from '../types';
import { Star, Tag, ChevronDown, ChevronUp, Sparkles, IndianRupee, ThumbsUp } from 'lucide-react';

interface Props {
  product: RecommendedProduct;
  alternative?: BudgetAlternative;
  showAlternative?: boolean;
}

const ProductCard: React.FC<Props> = ({ product, alternative, showAlternative = true }) => {
  const [expanded, setExpanded] = useState(false);

  const priceColor = product.priceCategory === 'low'
    ? 'text-green-600 bg-green-50 border-green-100'
    : product.priceCategory === 'medium'
    ? 'text-blue-600 bg-blue-50 border-blue-100'
    : 'text-purple-600 bg-purple-50 border-purple-100';

  const priceLabel = product.priceCategory === 'low'
    ? '💰 Budget-Friendly'
    : product.priceCategory === 'medium'
    ? '💎 Mid-Range'
    : '👑 Premium';

  const ratingStars = Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      size={12}
      className={i < Math.round(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}
    />
  ));

  return (
    <div className="border-2 border-gray-100 rounded-2xl p-4 hover:shadow-lg transition-all duration-300 bg-white group">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <h5 className="font-bold text-gray-800 text-sm leading-tight mb-1">{product.name}</h5>
          <p className="text-xs text-gray-400">by {product.brand}</p>
        </div>
        <div className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${priceColor}`}>
          {priceLabel}
        </div>
      </div>

      {/* Rating & Price Row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1">
          {ratingStars}
          <span className="text-xs text-gray-500 ml-1">{product.rating}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-700 font-semibold text-sm">
          <IndianRupee size={14} />
          {product.actualPrice}
        </div>
      </div>

      {/* Why Recommended */}
      <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl p-3 mb-3 border border-teal-100">
        <div className="flex items-start gap-2">
          <Sparkles size={14} className="text-teal-500 flex-shrink-0 mt-0.5" />
          <div>
            <span className="text-[10px] font-bold text-teal-600 uppercase tracking-wider">Why This Product</span>
            <p className="text-teal-800 text-xs mt-0.5 leading-relaxed">{product.whyRecommended}</p>
          </div>
        </div>
      </div>

      {/* Key Ingredients */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {product.keyIngredients.map((ing, i) => (
          <span key={i} className="px-2 py-0.5 bg-gray-50 text-gray-600 rounded-full text-[10px] font-medium border border-gray-100 capitalize">
            {ing}
          </span>
        ))}
      </div>

      {/* Suitable For */}
      <div className="flex flex-wrap gap-1 mb-3">
        {product.suitableFor.slice(0, 4).map((s, i) => (
          <span key={i} className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-medium">
            {s}
          </span>
        ))}
      </div>

      {/* Budget Alternative */}
      {showAlternative && alternative && (
        <div className="mt-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between px-3 py-2 bg-amber-50 rounded-xl text-amber-700 text-xs font-semibold hover:bg-amber-100 transition-colors border border-amber-100"
          >
            <span className="flex items-center gap-1.5">
              <Tag size={14} />
              💸 Budget Alternative Available — Save {alternative.savings}
            </span>
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {expanded && (
            <div className="mt-2 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-3 border border-amber-100">
              <div className="flex items-center justify-between mb-2">
                <h6 className="font-bold text-amber-800 text-xs">{alternative.alternative.name}</h6>
                <span className="flex items-center gap-1 text-green-600 font-bold text-xs">
                  <IndianRupee size={12} />
                  {alternative.alternative.actualPrice}
                </span>
              </div>
              <p className="text-[10px] text-amber-600 mb-1">by {alternative.alternative.brand}</p>
              <p className="text-amber-700 text-xs leading-relaxed mb-2">{alternative.comparisonNotes}</p>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  alternative.valueForMoney === 'excellent' ? 'bg-green-100 text-green-700' :
                  alternative.valueForMoney === 'good' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {alternative.valueForMoney === 'excellent' && <ThumbsUp size={10} className="inline mr-1" />}
                  Value: {alternative.valueForMoney}
                </span>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} size={10} className={i < Math.round(alternative.alternative.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductCard;
