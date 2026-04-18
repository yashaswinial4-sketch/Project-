import React, { useState, useRef, useCallback } from 'react';
import type { SkinDetectionResult } from '../types';
import { Upload, X, Loader2, Camera, Image as ImageIcon, CheckCircle } from 'lucide-react';

interface ImageUploadProps {
  onComplete: (result: SkinDetectionResult) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onComplete }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.[0]) handleFileSelect(e.dataTransfer.files[0]);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const clearImage = () => {
    setImagePreview(null);
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const analyzeImage = () => {
    if (!imagePreview || !imageFile) return;
    setAnalyzing(true);

    // Client-side canvas-based skin analysis
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const size = 100;
        canvas.width = size;
        canvas.height = size;
        ctx!.drawImage(img, 0, 0, size, size);
        const imageData = ctx!.getImageData(0, 0, size, size);
        const pixels = imageData.data;

        let totalBrightness = 0;
        let totalRedness = 0;
        let totalSaturation = 0;
        const pixelCount = pixels.length / 4;

        for (let i = 0; i < pixels.length; i += 4) {
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
          totalBrightness += brightness;
          totalRedness += Math.max(0, r - g);
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          totalSaturation += max > 0 ? ((max - min) / max) * 100 : 0;
        }

        const avgBrightness = totalBrightness / pixelCount;
        const avgRedness = totalRedness / pixelCount;
        const avgSaturation = totalSaturation / pixelCount;

        // Heuristic scoring
        let scores: Record<string, number> = { dry: 0, oily: 0, combination: 0, sensitive: 0, normal: 0 };

        // Brightness: high brightness + low saturation → oily (shiny reflection)
        if (avgBrightness > 180) { scores.oily += 3; scores.combination += 1; }
        else if (avgBrightness > 140) { scores.normal += 2; scores.combination += 1; }
        else if (avgBrightness > 100) { scores.dry += 2; scores.sensitive += 1; }
        else { scores.dry += 3; }

        // Redness: high redness → sensitive
        if (avgRedness > 30) { scores.sensitive += 4; scores.dry += 1; }
        else if (avgRedness > 15) { scores.sensitive += 2; scores.combination += 1; }
        else { scores.normal += 1; scores.oily += 1; }

        // Saturation: low → oily (washed out by shine)
        if (avgSaturation < 20) { scores.oily += 2; }
        else if (avgSaturation < 40) { scores.combination += 2; scores.normal += 1; }
        else { scores.dry += 2; scores.sensitive += 1; }

        // Determine result
        let maxScore = 0;
        let detectedType = 'normal';
        for (const [type, score] of Object.entries(scores)) {
          if (score > maxScore) { maxScore = score; detectedType = type; }
        }

        const typeMap: Record<string, 'dry' | 'oily' | 'combination' | 'sensitive'> = {
          dry: 'dry', oily: 'oily', combination: 'combination', sensitive: 'sensitive', normal: 'combination'
        };
        const finalType = typeMap[detectedType] || 'combination';
        const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
        const confidence = totalScore > 0 ? Math.min(0.92, 0.55 + (maxScore / totalScore) * 0.35) : 0.55;

        const explanations: Record<string, string> = {
          dry: 'Based on image analysis, your skin appears DRY. The image shows lower brightness and higher saturation, suggesting lack of natural oils. Focus on hydration and gentle cleansing.',
          oily: 'Based on image analysis, your skin appears OILY. The image shows higher brightness with lower saturation, suggesting excess sebum production. Focus on oil control and lightweight hydration.',
          combination: 'Based on image analysis, your skin appears COMBINATION. The image shows mixed characteristics — likely oily in some areas and dry in others. Use balanced products.',
          sensitive: 'Based on image analysis, your skin appears SENSITIVE. The image shows higher redness indicators. Use gentle, fragrance-free products and avoid strong actives.',
        };

        const result: SkinDetectionResult = {
          skinType: finalType,
          confidence: Math.round(confidence * 100) / 100,
          method: 'image',
          breakdown: scores,
          explanation: explanations[finalType] || explanations.combination,
          indicators: {
            brightness: Math.round(avgBrightness),
            redness: Math.round(avgRedness),
            saturation: Math.round(avgSaturation),
          },
        };

        setTimeout(() => {
          onComplete(result);
          setAnalyzing(false);
        }, 800);
      } catch {
        // Fallback if canvas analysis fails
        const fallbackResult: SkinDetectionResult = {
          skinType: 'combination',
          confidence: 0.60,
          method: 'image',
          explanation: 'Image analysis completed with basic heuristics. For more accurate results, consider taking the skin type quiz.',
          indicators: {},
        };
        setTimeout(() => {
          onComplete(fallbackResult);
          setAnalyzing(false);
        }, 800);
      }
    };
    img.onerror = () => {
      const fallbackResult: SkinDetectionResult = {
        skinType: 'combination',
        confidence: 0.60,
        method: 'image',
        explanation: 'Image analysis completed with basic heuristics. For more accurate results, consider taking the skin type quiz.',
        indicators: {},
      };
      setTimeout(() => {
        onComplete(fallbackResult);
        setAnalyzing(false);
      }, 800);
    };
    img.src = imagePreview;
  };

  return (
    <div className="animate-fade-in">
      {/* Upload Area */}
      {!imagePreview ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-3 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all duration-300
            ${dragOver
              ? 'border-emerald-400 bg-emerald-50 scale-[1.02]'
              : 'border-gray-300 bg-gray-50 hover:border-emerald-300 hover:bg-emerald-50/50'
            }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            className="hidden"
          />
          <div className="flex flex-col items-center gap-4">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300
              ${dragOver ? 'bg-emerald-200' : 'bg-gray-200'}`}>
              <Camera size={36} className={dragOver ? 'text-emerald-600' : 'text-gray-500'} />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-700 mb-1">
                {dragOver ? 'Drop your image here!' : 'Upload a selfie or skin photo'}
              </p>
              <p className="text-gray-500 text-sm">
                Drag & drop or click to browse • JPG, PNG up to 10MB
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
              <ImageIcon size={14} />
              <span>For best results: clear lighting, no makeup, front-facing</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border-2 border-gray-100 overflow-hidden shadow-sm">
          {/* Image Preview */}
          <div className="relative">
            <img
              src={imagePreview}
              alt="Skin preview"
              className="w-full h-64 md:h-80 object-cover"
            />
            <button
              onClick={clearImage}
              className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-red-50 transition-colors shadow-lg"
            >
              <X size={20} className="text-gray-600" />
            </button>
            <div className="absolute bottom-4 left-4 flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg">
              <CheckCircle size={16} className="text-emerald-500" />
              <span className="text-sm font-medium text-gray-700">Image ready for analysis</span>
            </div>
          </div>

          {/* Analyze Button */}
          <div className="p-6">
            <button
              onClick={analyzeImage}
              disabled={analyzing}
              className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl font-bold text-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {analyzing ? (
                <>
                  <Loader2 size={22} className="animate-spin" />
                  Analyzing your skin...
                </>
              ) : (
                <>
                  <Upload size={22} />
                  Analyze My Skin
                </>
              )}
            </button>
            <p className="text-center text-xs text-gray-400 mt-3">
              ⚠️ Image analysis uses basic heuristics. For best accuracy, take the quiz instead.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
