import { useState, useCallback, useRef } from 'react';
import './Home.css';

function Home() {
  const [isDragging, setIsDragging] = useState(false);
  const [droppedFile, setDroppedFile] = useState(null);
  const [error, setError] = useState(null);
  const dragCounter = useRef(0);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    setIsDragging(true);
    setError(null);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const processFile = useCallback((file) => {
    if (!file.name.endsWith('.dyn')) {
      setError('Only .dyn files are accepted');
      setDroppedFile(null);
      return;
    }
    setError(null);
    setDroppedFile(file);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current = 0;
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  }, [processFile]);

  const handleFileInput = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    e.target.value = '';
  }, [processFile]);

  const handleReset = useCallback(() => {
    setDroppedFile(null);
    setError(null);
  }, []);

  return (
    <div className="home">
      <h1 className="home-title">Drop a graph, get a story!</h1>
      <p className="home-subtitle">
        Load a Dynamo <code>.dyn</code> graph to generate its story
      </p>

      {droppedFile ? (
        <div className="file-card">
          <div className="file-card-icon">&#10003;</div>
          <div className="file-card-details">
            <p className="file-card-name">{droppedFile.name}</p>
            <p className="file-card-size">
              {(droppedFile.size / 1024).toFixed(1)} KB
            </p>
          </div>
          <button className="file-card-remove" onClick={handleReset} title="Remove file">
            &times;
          </button>
        </div>
      ) : (
        <div className="upload-controls">
          {/* Drag & drop zone */}
          <div
            className={`dropzone ${isDragging ? 'dropzone--active' : ''} ${error ? 'dropzone--error' : ''}`}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="dropzone-inner">
              <span className="dropzone-icon">
                {isDragging ? '\u2B07\uFE0F' : '\uD83D\uDCC4'}
              </span>
              <p className="dropzone-heading">
                {isDragging ? 'Drop it here!' : 'Drag & drop'}
              </p>
              <p className="dropzone-hint">
                {isDragging
                  ? 'Release to load your graph'
                  : 'Drop a .dyn file anywhere in this zone'}
              </p>
            </div>
          </div>

          <div className="upload-divider">
            <span>or</span>
          </div>

          {/* Browse from disk */}
          <label className="browse-btn">
            <span className="browse-btn-icon">{'\uD83D\uDCC1'}</span>
            <span className="browse-btn-text">Browse from disk</span>
            <span className="browse-btn-hint">Select a .dyn file from your computer</span>
            <input
              type="file"
              accept=".dyn"
              onChange={handleFileInput}
              hidden
            />
          </label>
        </div>
      )}

      {error && <p className="home-error">{error}</p>}
    </div>
  );
}

export default Home;
