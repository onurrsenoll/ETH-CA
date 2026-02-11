import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  Building2,
  Target,
  FileText,
  Settings,
  BarChart3,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const navItems = [
  { path: '/', label: 'Ana Panel', icon: LayoutDashboard },
  { path: '/uretim-ekle', label: 'Üretim Ekle', icon: PlusCircle },
  { path: '/subeler', label: 'Şube Yönetimi', icon: Building2 },
  { path: '/hedefler', label: 'Hedefler', icon: Target },
  { path: '/raporlar', label: 'Raporlar', icon: FileText },
  { path: '/ayarlar', label: 'Ayarlar', icon: Settings },
];

export default function Sidebar() {
  const { settings } = useApp();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <BarChart3 size={28} />
        <div>
          <h1 className="sidebar-title">{settings.companyName}</h1>
          <p className="sidebar-subtitle">Üretim Takip Sistemi</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <p>Basamak: {settings.currentStep}</p>
        <p>{settings.currentYear}</p>
      </div>
    </aside>
  );
}
