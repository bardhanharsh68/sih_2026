import { useState } from 'react';
import './HeatmapOverlay.css';
import { useApp } from '../context/AppContext';
import { Layers, Image as ImageIcon } from 'lucide-react';

export default function HeatmapOverlay({ fundusImage, heatmapImage }) {
  const [overlayOpacity, setOverlayOpacity] = useState(0);
  const { t } = useApp();
  const showingHeatmap = overlayOpacity > 0;

  return (
    <div className="heatmap-container" id="heatmap-overlay">
      <div className="heatmap-image-stack">
        <img
          src={fundusImage}
          alt="Fundus retinal image"
          className="heatmap-base-image"
        />
        <img
          src={heatmapImage}
          alt="AI Grad-CAM heatmap overlay"
          className="heatmap-overlay-image"
          style={{ opacity: overlayOpacity }}
        />
      </div>

      <div className="heatmap-controls glass-card-static">
        <div className="heatmap-toggle-labels">
          <span className={!showingHeatmap ? 'active-label' : ''}>
            <ImageIcon size={14} />
            {t('result.rawImage')}
          </span>
          <span className={showingHeatmap ? 'active-label' : ''}>
            <Layers size={14} />
            {t('result.overlay')}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={overlayOpacity}
          onChange={(e) => setOverlayOpacity(parseFloat(e.target.value))}
          className="heatmap-slider"
          id="heatmap-slider"
          aria-label="Heatmap overlay opacity"
        />
      </div>
    </div>
  );
}
