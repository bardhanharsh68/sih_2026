import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import SeverityBadge from '../components/SeverityBadge';
import ConfidenceGauge from '../components/ConfidenceGauge';
import HeatmapOverlay from '../components/HeatmapOverlay';
import { generateFundusDataUrl, generateHeatmapDataUrl } from '../utils/generateFundusImage';
import {
  Download, Share2, Save, ArrowLeft, AlertCircle, CheckCircle2, Info, Plus
} from 'lucide-react';
import predictions from '../data/predictions.json';
import patients from '../data/patients.json';
import './ResultPage.css';

export default function ResultPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, language, showToast, uploadedImage } = useApp();

  // Find prediction & patient data
  const screeningId = id || 'SCR-001';
  const predData = predictions[screeningId] || predictions['SCR-001'];
  const patientData = patients.find(p => p.screeningId === screeningId) || {
    id: 'PAT-001',
    name: 'Ramesh Kumar',
    nameHi: 'रमेश कुमार',
    age: 54,
    gender: 'Male',
    village: 'Sundarnagar',
    villageHi: 'सुंदरनगर',
    screeningDate: '2026-09-06',
  };

  // Generate fundus & heatmap images
  const fundusImg = useMemo(() => {
    return uploadedImage || generateFundusDataUrl(predData.severity);
  }, [uploadedImage, predData.severity]);

  const heatmapImg = useMemo(() => {
    return generateHeatmapDataUrl(predData.severity);
  }, [predData.severity]);

  const handleSave = () => {
    showToast(t('result.saved'));
  };

  const handleExport = () => {
    showToast(t('result.exported'));
  };

  const handleShare = () => {
    showToast('SMS link sent to patient phone number!');
  };

  const isUrgent = predData.referral.urgency === 'high' || predData.referral.urgency === 'critical';

  return (
    <div className="page" id="result-page">
      {/* Header with back button */}
      <div className="page-header flex-between">
        <div>
          <button className="btn btn-ghost btn-sm back-btn" onClick={() => navigate('/dashboard')} id="result-back-btn">
            <ArrowLeft size={16} />
            {t('common.back')}
          </button>
          <h1 className="page-title">{t('result.title')}</h1>
        </div>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => navigate('/screening/intake')}
          id="result-new-screening-btn"
        >
          <Plus size={16} />
          {t('result.newScreening')}
        </button>
      </div>

      {/* Patient Banner */}
      <div className="glass-card patient-banner" id="result-patient-banner">
        <div className="patient-banner-details">
          <span className="patient-banner-name">
            {language === 'hi' ? patientData.nameHi || patientData.name : patientData.name}
          </span>
          <span className="patient-banner-meta">
            {patientData.age} y/o {patientData.gender} · {language === 'hi' ? patientData.villageHi || patientData.village : patientData.village} · ID: {patientData.patientId || patientData.id}
          </span>
        </div>
        <span className="patient-banner-date">{patientData.screeningDate}</span>
      </div>

      <div className="result-grid">
        {/* Left Column: Visual Explainability (Heatmap + Gauge) */}
        <div className="result-col stack">
          {/* Heatmap Overlay Card */}
          <div className="glass-card-static result-card" id="result-heatmap-card">
            <h3>{t('result.explainability')}</h3>
            <HeatmapOverlay fundusImage={fundusImg} heatmapImage={heatmapImg} />
          </div>
        </div>

        {/* Right Column: Severity, Findings & Referral */}
        <div className="result-col stack">
          {/* Severity & Confidence Summary */}
          <div className="glass-card result-card summary-card" id="result-summary-card">
            <div className="summary-left">
              <span className="summary-label">{t('result.severity')}</span>
              <div className="severity-display">
                <SeverityBadge severity={predData.severity} size="lg" />
              </div>
              <span className="severity-title">
                {language === 'hi' ? predData.severityLabelHi : predData.severityLabel}
              </span>
            </div>

            <div className="summary-right">
              <ConfidenceGauge value={predData.confidence} size={120} />
            </div>
          </div>

          {/* Plain Language Explanation */}
          <div className="glass-card result-card" id="result-explanation-card">
            <h3 className="card-heading">
              <Info size={18} className="heading-icon" />
              {t('result.explanation')}
            </h3>
            <p className="explanation-text">
              {language === 'hi' ? predData.explanationHi : predData.explanation}
            </p>
          </div>

          {/* Detected Findings */}
          {predData.findings && predData.findings.length > 0 && (
            <div className="glass-card result-card" id="result-findings-card">
              <h3 className="card-heading">{t('result.findings')}</h3>
              <div className="findings-tags">
                {predData.findings.map((f, i) => (
                  <div className="finding-tag glass-card" key={i}>
                    <span className="finding-count">{f.count}</span>
                    <div className="finding-info">
                      <span className="finding-label">{language === 'hi' ? f.labelHi : f.label}</span>
                      <span className="finding-location">{language === 'hi' ? f.locationHi : f.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Referral Recommendation Card */}
          <div className={`glass-card result-card referral-card ${isUrgent ? 'referral-urgent' : ''}`} id="result-referral-card">
            <h3 className="card-heading">
              {predData.referral.required ? (
                <AlertCircle size={20} className="urgent-icon" />
              ) : (
                <CheckCircle2 size={20} className="safe-icon" />
              )}
              {t('result.referral')}
            </h3>
            <p className="referral-text">
              {language === 'hi' ? predData.referral.recommendationHi : predData.referral.recommendation}
            </p>
          </div>

          {/* Actions Bar */}
          <div className="result-actions" id="result-actions">
            <button className="btn btn-primary" onClick={handleSave} id="save-btn">
              <Save size={18} />
              {t('result.save')}
            </button>
            <button className="btn btn-ghost" onClick={handleExport} id="export-btn">
              <Download size={18} />
              {t('result.export')}
            </button>
            <button className="btn btn-ghost" onClick={handleShare} id="share-btn">
              <Share2 size={18} />
              {t('result.share')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
