import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Globe, Moon, Sun, Wifi, User, Info, LogOut, Check
} from 'lucide-react';
import './SettingsPage.css';

export default function SettingsPage() {
  const {
    language, toggleLanguage,
    theme, setTheme,
    isOffline, setIsOffline,
    userName, role, logout, t
  } = useApp();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="page" id="settings-page">
      <div className="page-header">
        <h1 className="page-title">{t('settings.title')}</h1>
      </div>

      <div className="settings-stack stack stagger-children">
        {/* User Profile Card */}
        <div className="glass-card settings-card" id="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              <User size={28} />
            </div>
            <div className="profile-info">
              <span className="profile-name">{userName || 'Health Worker'}</span>
              <span className="profile-role">
                {role === 'admin' ? t('login.admin') : role === 'physician' ? t('login.physician') : t('login.healthWorker')}
              </span>
            </div>
          </div>
        </div>

        {/* Language Selection */}
        <div className="glass-card settings-card" id="language-card">
          <div className="settings-row">
            <div className="settings-row-info">
              <Globe size={20} className="settings-icon" />
              <div>
                <span className="settings-label">{t('settings.language')}</span>
                <span className="settings-desc">Choose UI language (English / हिंदी)</span>
              </div>
            </div>

            <div className="lang-toggle-group">
              <button
                className={`lang-btn ${language === 'en' ? 'lang-active' : ''}`}
                onClick={language === 'hi' ? toggleLanguage : undefined}
                id="lang-en-btn"
              >
                English {language === 'en' && <Check size={14} />}
              </button>
              <button
                className={`lang-btn ${language === 'hi' ? 'lang-active' : ''}`}
                onClick={language === 'en' ? toggleLanguage : undefined}
                id="lang-hi-btn"
              >
                हिंदी {language === 'hi' && <Check size={14} />}
              </button>
            </div>
          </div>
        </div>

        {/* Theme Selection */}
        <div className="glass-card settings-card" id="theme-card">
          <div className="settings-row">
            <div className="settings-row-info">
              {theme === 'dark' ? <Moon size={20} className="settings-icon" /> : <Sun size={20} className="settings-icon" />}
              <div>
                <span className="settings-label">{t('settings.theme')}</span>
                <span className="settings-desc">Switch between light clinical and dark mode</span>
              </div>
            </div>

            <button className="btn btn-ghost btn-sm" onClick={setTheme} id="theme-toggle-btn">
              {theme === 'dark' ? (
                <>
                  <Sun size={16} />
                  {t('settings.lightMode')}
                </>
              ) : (
                <>
                  <Moon size={16} />
                  {t('settings.darkMode')}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Offline Mode Switch */}
        <div className="glass-card settings-card" id="offline-card">
          <div className="settings-row">
            <div className="settings-row-info">
              <Wifi size={20} className="settings-icon" />
              <div>
                <span className="settings-label">{t('settings.offline')}</span>
                <span className="settings-desc">{t('settings.offlineDesc')}</span>
              </div>
            </div>

            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={isOffline}
                onChange={(e) => setIsOffline(e.target.checked)}
                id="offline-toggle-input"
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        {/* About Card */}
        <div className="glass-card settings-card" id="about-card">
          <div className="settings-row">
            <div className="settings-row-info">
              <Info size={20} className="settings-icon" />
              <div>
                <span className="settings-label">{t('settings.about')}</span>
                <span className="settings-desc">{t('settings.version')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Logout */}
        <button className="btn btn-danger btn-lg logout-btn" onClick={handleLogout} id="logout-btn">
          <LogOut size={20} />
          {t('settings.logout')}
        </button>
      </div>
    </div>
  );
}
