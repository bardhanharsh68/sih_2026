import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { useApp } from '../context/AppContext';
import { Upload, Camera, Image as ImageIcon, X, Zap, FileImage } from 'lucide-react';
import './ImageUploadPage.css';

// Sample fundus image URL (a realistic placeholder)
const SAMPLE_FUNDUS = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Fundus_photograph_of_normal_right_eye.jpg/800px-Fundus_photograph_of_normal_right_eye.jpg';

export default function ImageUploadPage() {
  const { t, setUploadedImage } = useApp();
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState('');

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setFileName(file.name);
      const url = URL.createObjectURL(file);
      setPreview(url);
      setUploadedImage(url);
    }
  }, [setUploadedImage]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png'] },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
  });

  const useSample = () => {
    setPreview(SAMPLE_FUNDUS);
    setUploadedImage(SAMPLE_FUNDUS);
    setFileName('sample_fundus.jpg');
  };

  const removeImage = () => {
    setPreview(null);
    setUploadedImage(null);
    setFileName('');
  };

  const handleAnalyze = () => {
    navigate('/screening/processing');
  };

  return (
    <div className="page" id="upload-page">
      <div className="page-header">
        <h1 className="page-title">{t('upload.title')}</h1>
        <p className="page-subtitle">{t('upload.subtitle')}</p>
      </div>

      {!preview ? (
        <>
          {/* Drop Zone */}
          <div
            {...getRootProps()}
            className={`upload-dropzone glass-card-static ${isDragActive ? 'dropzone-active' : ''}`}
            id="upload-dropzone"
          >
            <input {...getInputProps()} id="upload-input" />
            <div className="dropzone-content">
              <div className="dropzone-icon">
                <Upload size={40} />
              </div>
              <p className="dropzone-text">{t('upload.dragDrop')}</p>
              <p className="dropzone-or">{t('upload.or')}</p>
              <span className="btn btn-ghost">
                <FileImage size={18} />
                {t('upload.browse')}
              </span>
              <p className="dropzone-formats">{t('upload.supportedFormats')}</p>
            </div>
          </div>

          {/* Alt Actions */}
          <div className="upload-actions">
            <button className="btn btn-ghost" onClick={useSample} id="use-sample-btn">
              <ImageIcon size={18} />
              {t('upload.useSample')}
            </button>
            <button className="btn btn-ghost" onClick={useSample} id="use-camera-btn">
              <Camera size={18} />
              {t('upload.camera')}
            </button>
          </div>
        </>
      ) : (
        /* Preview */
        <div className="upload-preview animate-fade-in" id="upload-preview">
          <div className="preview-card glass-card-static">
            <div className="preview-header">
              <h3>{t('upload.preview')}</h3>
              <button className="btn btn-ghost btn-sm" onClick={removeImage} id="remove-image-btn">
                <X size={16} />
                {t('upload.remove')}
              </button>
            </div>
            <div className="preview-image-wrapper">
              <img src={preview} alt="Fundus preview" className="preview-image" />
            </div>
            {fileName && <p className="preview-filename">{fileName}</p>}
          </div>

          <button
            className="btn btn-primary btn-lg analyze-btn"
            onClick={handleAnalyze}
            id="analyze-btn"
          >
            <Zap size={20} />
            {t('upload.analyze')}
          </button>
        </div>
      )}
    </div>
  );
}
