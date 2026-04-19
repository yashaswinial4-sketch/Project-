import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SkinProvider } from './context/SkinContext';
import HomePage from './pages/HomePage';
import SkinTypePage from './pages/SkinTypePage';
import AnalysisPage from './pages/AnalysisPage';
import ResultPage from './pages/ResultPage';
import AcneRiskPage from './pages/AcneRiskPage';
import ProgressPage from './pages/ProgressPage';
import IngredientAnalysisPage from './pages/IngredientAnalysisPage';
import RoutineGeneratorPage from './pages/RoutineGeneratorPage';
import DashboardPage from './pages/DashboardPage';
import SimpleAnalysisPage from './pages/SimpleAnalysisPage';

const App: React.FC = () => {
  return (
    <SkinProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/skin-type" element={<SkinTypePage />} />
            <Route path="/analyze" element={<AnalysisPage />} />
            <Route path="/result" element={<ResultPage />} />
            <Route path="/acne-risk" element={<AcneRiskPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/ingredient-analysis" element={<IngredientAnalysisPage />} />
            <Route path="/routine" element={<RoutineGeneratorPage />} />
            <Route path="/simple-analysis" element={<SimpleAnalysisPage />} />
          </Routes>
        </div>
      </Router>
    </SkinProvider>
  );
};

export default App;
