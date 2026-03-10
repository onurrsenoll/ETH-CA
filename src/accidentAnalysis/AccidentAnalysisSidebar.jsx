import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, ArrowLeft, Car } from 'lucide-react';

export default function AccidentAnalysisSidebar() {
  return (
    <aside className="aa-sidebar">
      <div className="aa-sidebar-header">
        <Car size={28} />
        <div>
          <h2>Kaza Analiz</h2>
          <span>Tespit Tutanağı Sistemi</span>
        </div>
      </div>

      <nav className="aa-sidebar-nav">
        <NavLink to="/kaza-analiz" end className={({ isActive }) => `aa-nav-link ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={20} />
          <span>Analiz Paneli</span>
        </NavLink>
        <NavLink to="/kaza-analiz/yeni" className={({ isActive }) => `aa-nav-link ${isActive ? 'active' : ''}`}>
          <PlusCircle size={20} />
          <span>Yeni Analiz</span>
        </NavLink>
      </nav>

      <div className="aa-sidebar-footer">
        <NavLink to="/" className="aa-nav-link aa-nav-link-back">
          <ArrowLeft size={20} />
          <span>Ana Sisteme Dön</span>
        </NavLink>
      </div>
    </aside>
  );
}
