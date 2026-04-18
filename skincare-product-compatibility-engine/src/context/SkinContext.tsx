import React, { createContext, useContext, useState, useCallback } from 'react';
import type { SkinType, SkinContextType } from '../types';

const SkinContext = createContext<SkinContextType | undefined>(undefined);

export const SkinProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [detectedSkinType, setDetectedSkinTypeState] = useState<SkinType | ''>(() => {
    return (sessionStorage.getItem('detectedSkinType') as SkinType) || '';
  });
  const [detectionMethod, setDetectionMethodState] = useState<'questionnaire' | 'image' | ''>(() => {
    return (sessionStorage.getItem('detectionMethod') as 'questionnaire' | 'image') || '';
  });
  const [detectionConfidence, setDetectionConfidenceState] = useState<number>(() => {
    return parseFloat(sessionStorage.getItem('detectionConfidence') || '0');
  });

  const setDetectedSkinType = useCallback((type: SkinType, method: 'questionnaire' | 'image', confidence: number) => {
    setDetectedSkinTypeState(type);
    setDetectionMethodState(method);
    setDetectionConfidenceState(confidence);
    sessionStorage.setItem('detectedSkinType', type);
    sessionStorage.setItem('detectionMethod', method);
    sessionStorage.setItem('detectionConfidence', confidence.toString());
  }, []);

  const clearDetection = useCallback(() => {
    setDetectedSkinTypeState('');
    setDetectionMethodState('');
    setDetectionConfidenceState(0);
    sessionStorage.removeItem('detectedSkinType');
    sessionStorage.removeItem('detectionMethod');
    sessionStorage.removeItem('detectionConfidence');
  }, []);

  return (
    <SkinContext.Provider value={{
      detectedSkinType,
      detectionMethod,
      detectionConfidence,
      setDetectedSkinType,
      clearDetection
    }}>
      {children}
    </SkinContext.Provider>
  );
};

export const useSkinContext = (): SkinContextType => {
  const context = useContext(SkinContext);
  if (!context) {
    throw new Error('useSkinContext must be used within a SkinProvider');
  }
  return context;
};

export default SkinContext;
