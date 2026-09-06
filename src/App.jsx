import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import OfflineIndicator from './components/OfflineIndicator';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PatientIntakePage from './pages/PatientIntakePage';
import ImageUploadPage from './pages/ImageUploadPage';
import ProcessingPage from './pages/ProcessingPage';
import ResultPage from './pages/ResultPage';
import PatientHistoryPage from './pages/PatientHistoryPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <OfflineIndicator />
        <Navbar />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/screening/intake" element={<PatientIntakePage />} />
          <Route path="/screening/upload" element={<ImageUploadPage />} />
          <Route path="/screening/processing" element={<ProcessingPage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/result/:id" element={<ResultPage />} />
          <Route path="/records" element={<PatientHistoryPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
