import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import AddProduction from './pages/AddProduction';
import BranchManagement from './pages/BranchManagement';
import Targets from './pages/Targets';
import Reports from './pages/Reports';
import SettingsPage from './pages/SettingsPage';
import './App.css';

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
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
      </HashRouter>
    </AppProvider>
  );
}
