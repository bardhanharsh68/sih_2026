import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Eye } from 'lucide-react';
import './ProcessingPage.css';

const STEPS_EN = [
  'Preprocessing image...',
  'Running AI model...',
  'Generating explanation...',
  'Preparing results...',
];

export default function ProcessingPage() {
  const { t } = useApp();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = [
    t('processing.step1'),
    t('processing.step2'),
    t('processing.step3'),
    t('processing.step4'),
  ];

  useEffect(() => {
    const totalDuration = 4000; // 4 seconds total
    const stepDuration = totalDuration / steps.length;

    // Progress bar
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        return prev + 1;
      });
    }, totalDuration / 100);

    // Step cycling
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= steps.length - 1) return prev;
        return prev + 1;
      });
    }, stepDuration);

    // Navigate to result after completion
    const timer = setTimeout(() => {
      // Navigate to a mock result (SCR-001)
      navigate('/result/SCR-001');
    }, totalDuration + 500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
      clearTimeout(timer);
    };
  }, [navigate, steps.length]);

  return (
    <div className="processing-page" id="processing-page">
      <div className="processing-content animate-fade-in">
        {/* Pulsing retina icon */}
        <div className="processing-icon-wrapper">
          <div className="processing-ring processing-ring-1"></div>
          <div className="processing-ring processing-ring-2"></div>
          <div className="processing-ring processing-ring-3"></div>
          <div className="processing-icon">
            <Eye size={40} />
          </div>
        </div>

        <h2 className="processing-title">{t('processing.analyzing')}</h2>

        {/* Steps */}
        <div className="processing-steps">
          {steps.map((step, i) => (
            <div
              key={i}
              className={`processing-step ${i < currentStep ? 'step-done' : ''} ${i === currentStep ? 'step-active' : ''} ${i > currentStep ? 'step-pending' : ''}`}
            >
              <div className="step-dot">
                {i < currentStep && '✓'}
                {i === currentStep && <span className="step-spinner"></span>}
              </div>
              <span>{step}</span>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="processing-progress-bar">
          <div className="processing-progress-fill" style={{ width: `${progress}%` }}></div>
        </div>

        <p className="processing-hint">{t('processing.pleaseWait')}</p>
      </div>
    </div>
  );
}
