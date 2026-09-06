import { NavLink, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard, ScanEye, ClipboardList, Settings, BarChart3
} from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const { role, t } = useApp();
  const location = useLocation();

  // Don't show nav on login page
  if (location.pathname === '/' || location.pathname === '/login') return null;

  const healthWorkerLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: t('nav.dashboard') },
    { to: '/screening/intake', icon: ScanEye, label: t('nav.newScreening') },
    { to: '/records', icon: ClipboardList, label: t('nav.records') },
    { to: '/settings', icon: Settings, label: t('nav.settings') },
  ];

  const adminLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: t('nav.dashboard') },
    { to: '/admin', icon: BarChart3, label: t('nav.analytics') },
    { to: '/records', icon: ClipboardList, label: t('nav.records') },
    { to: '/settings', icon: Settings, label: t('nav.settings') },
  ];

  const links = role === 'admin' ? adminLinks : healthWorkerLinks;

  return (
    <nav className="bottom-nav glass-nav" id="main-nav">
      {links.map(link => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) => `nav-item ${isActive ? 'nav-item-active' : ''}`}
          id={`nav-${link.to.replace(/\//g, '-').slice(1)}`}
        >
          <link.icon size={22} />
          <span className="nav-label">{link.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
