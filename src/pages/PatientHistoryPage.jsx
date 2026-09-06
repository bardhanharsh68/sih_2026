import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import SeverityBadge from '../components/SeverityBadge';
import { Search, Filter, Calendar, MapPin, User, ChevronRight } from 'lucide-react';
import patients from '../data/patients.json';
import './PatientHistoryPage.css';

export default function PatientHistoryPage() {
  const { t, language } = useApp();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [villageFilter, setVillageFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');

  const filteredPatients = useMemo(() => {
    return patients.filter(p => {
      const nameMatch = (language === 'hi' ? p.nameHi : p.name).toLowerCase().includes(search.toLowerCase()) ||
                        p.id.toLowerCase().includes(search.toLowerCase());
      const villageMatch = villageFilter === 'all' || p.village === villageFilter;
      const severityMatch = severityFilter === 'all' || p.severity === severityFilter;

      return nameMatch && villageMatch && severityMatch;
    });
  }, [search, villageFilter, severityFilter, language]);

  return (
    <div className="page" id="records-page">
      <div className="page-header">
        <h1 className="page-title">{t('history.title')}</h1>
        <p className="page-subtitle">{t('history.subtitle')}</p>
      </div>

      {/* Filters & Search */}
      <div className="glass-card-static records-filter-bar" id="records-filter-bar">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="form-input search-input"
            placeholder={t('history.search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            id="records-search-input"
          />
        </div>

        <div className="filter-dropdowns">
          <div className="filter-item">
            <MapPin size={14} />
            <select
              className="form-select filter-select"
              value={villageFilter}
              onChange={(e) => setVillageFilter(e.target.value)}
              id="records-village-filter"
            >
              <option value="all">{t('history.filterVillage')}: {t('history.all')}</option>
              <option value="Sundarnagar">Sundarnagar</option>
              <option value="Chandpur">Chandpur</option>
              <option value="Rampur">Rampur</option>
              <option value="Biharipur">Biharipur</option>
            </select>
          </div>

          <div className="filter-item">
            <Filter size={14} />
            <select
              className="form-select filter-select"
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              id="records-severity-filter"
            >
              <option value="all">{t('history.filterSeverity')}: {t('history.all')}</option>
              <option value="none">{t('severity.none')}</option>
              <option value="mild">{t('severity.mild')}</option>
              <option value="moderate">{t('severity.moderate')}</option>
              <option value="severe">{t('severity.severe')}</option>
              <option value="proliferative">{t('severity.proliferative')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Records Table / Cards */}
      <div className="records-list stack stagger-children" id="records-list">
        {filteredPatients.length === 0 ? (
          <div className="glass-card empty-state">
            <User size={40} className="empty-icon" />
            <p>{t('history.noResults')}</p>
          </div>
        ) : (
          filteredPatients.map(patient => (
            <div
              key={patient.id}
              className="glass-card record-card"
              onClick={() => navigate(`/result/${patient.screeningId}`)}
              id={`record-${patient.id}`}
            >
              <div className="record-main">
                <div className="record-avatar">
                  {patient.name.charAt(0)}
                </div>
                <div className="record-info">
                  <div className="record-name-row">
                    <span className="record-name">{language === 'hi' ? patient.nameHi : patient.name}</span>
                    <span className="record-id">{patient.id}</span>
                  </div>
                  <div className="record-sub">
                    <span>{patient.age} yrs · {patient.gender}</span>
                    <span><MapPin size={12} /> {language === 'hi' ? patient.villageHi : patient.village}</span>
                    <span><Calendar size={12} /> {patient.screeningDate}</span>
                  </div>
                </div>
              </div>

              <div className="record-right">
                <SeverityBadge severity={patient.severity} />
                <ChevronRight size={18} className="record-arrow" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
