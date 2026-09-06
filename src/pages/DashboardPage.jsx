import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import SeverityBadge from '../components/SeverityBadge';
import { ScanEye, Users, AlertCircle, ArrowUpRight, Plus } from 'lucide-react';
import patients from '../data/patients.json';
import './DashboardPage.css';

export default function DashboardPage() {
  const { userName, t, language } = useApp();
  const navigate = useNavigate();

  const totalScreenings = patients.length;
  const drPositive = patients.filter(p => p.severity !== 'none').length;
  const referrals = patients.filter(p => p.referred).length;

  const stats = [
    { label: t('dashboard.totalScreenings'), value: totalScreenings, icon: ScanEye, color: 'var(--accent-primary)' },
    { label: t('dashboard.drPositive'), value: drPositive, icon: AlertCircle, color: 'var(--accent-alert)' },
    { label: t('dashboard.referrals'), value: referrals, icon: Users, color: 'var(--accent-caution)' },
  ];

  const recentPatients = [...patients].reverse().slice(0, 5);

  return (
    <div className="page" id="dashboard-page">
      {/* Header */}
      <div className="page-header">
        <p className="dashboard-greeting">{t('dashboard.greeting')},</p>
        <h1 className="page-title">{userName || 'Dr. Sharma'} 👋</h1>
      </div>

      {/* Stats */}
      <div className="grid-3 stagger-children" id="dashboard-stats">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div className="glass-card stat-card" key={i}>
              <div className="stat-icon" style={{ background: `${stat.color}20`, color: stat.color }}>
                <Icon size={22} />
              </div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* New Screening CTA */}
      <button
        className="btn btn-primary btn-lg new-screening-cta"
        onClick={() => navigate('/screening/intake')}
        id="new-screening-btn"
      >
        <Plus size={22} />
        {t('dashboard.newScreening')}
        <ArrowUpRight size={18} />
      </button>

      {/* Recent Screenings */}
      <div className="recent-section">
        <div className="flex-between">
          <h2>{t('dashboard.recentScreenings')}</h2>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/records')} id="view-all-btn">
            {t('dashboard.viewAll')}
          </button>
        </div>

        <div className="stack stagger-children">
          {recentPatients.map((patient) => (
            <div
              className="glass-card patient-row"
              key={patient.id}
              onClick={() => navigate(`/result/${patient.screeningId}`)}
              id={`patient-${patient.id}`}
            >
              <div className="patient-row-info">
                <span className="patient-name">{language === 'hi' ? patient.nameHi : patient.name}</span>
                <span className="patient-meta">
                  {language === 'hi' ? patient.villageHi : patient.village} · {patient.screeningDate}
                </span>
              </div>
              <SeverityBadge severity={patient.severity} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
