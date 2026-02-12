import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import AddProduction from './pages/AddProduction';
import BranchManagement from './pages/BranchManagement';
import Targets from './pages/Targets';
import Reports from './pages/Reports';
import SettingsPage from './pages/SettingsPage';
import ValueLossLayout from './valueLoss/ValueLossLayout';
import ValueLossDashboard from './valueLoss/pages/ValueLossDashboard';
import ValueLossNewCase from './valueLoss/pages/ValueLossNewCase';
import ValueLossCaseDetail from './valueLoss/pages/ValueLossCaseDetail';
import ValueLossLawyers from './valueLoss/pages/ValueLossLawyers';
import './App.css';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Deger Kaybi Modulu - Bagimsiz */}
        <Route path="/deger-kaybi" element={<ValueLossLayout />}>
          <Route index element={<ValueLossDashboard />} />
          <Route path="yeni-dosya" element={<ValueLossNewCase />} />
          <Route path="dosya/:id" element={<ValueLossCaseDetail />} />
          <Route path="avukatlar" element={<ValueLossLawyers />} />
        </Route>

        {/* Mevcut Sistem */}
        <Route path="/*" element={
          <AppProvider>
            <div className="app-layout">
              <Sidebar />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/uretim-ekle" element={<AddProduction />} />
                  <Route path="/subeler" element={<BranchManagement />} />
                  <Route path="/hedefler" element={<Targets />} />
                  <Route path="/raporlar" element={<Reports />} />
                  <Route path="/ayarlar" element={<SettingsPage />} />
                </Routes>
              </main>
            </div>
          </AppProvider>
        } />
      </Routes>
    </HashRouter>
  );
}
