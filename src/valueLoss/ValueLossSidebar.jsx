import { NavLink } from 'react-router-dom';
import {
  Briefcase,
  FolderPlus,
  Users,
  ArrowLeft,
  Scale,
} from 'lucide-react';

const navItems = [
  { path: '/deger-kaybi', label: 'Dosyalarim', icon: Briefcase, end: true },
  { path: '/deger-kaybi/yeni-dosya', label: 'Yeni Dosya', icon: FolderPlus },
  { path: '/deger-kaybi/avukatlar', label: 'Avukatlarim', icon: Users },
];

export default function ValueLossSidebar() {
  return (
    <aside className="vl-sidebar">
      <div className="vl-sidebar-header">
        <Scale size={28} />
        <div>
          <h1 className="vl-sidebar-title">Deger Kaybi</h1>
          <p className="vl-sidebar-subtitle">Dosya Yonetim Sistemi</p>
        </div>
      </div>

      <nav className="vl-sidebar-nav">
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              `vl-sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="vl-sidebar-footer">
        <NavLink to="/" className="vl-sidebar-link vl-back-link">
          <ArrowLeft size={18} />
          <span>Ana Sisteme Don</span>
        </NavLink>
      </div>
    </aside>
  );
}
