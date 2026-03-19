import { useState, useCallback, useRef } from 'react';
import './Home.css';

function Home({ onGraphLoaded, onBrowseLibrary }) {
  const [isDragging, setIsDragging] = useState(false);
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

  const readAndLoad = useCallback((file) => {
    if (!file.name.endsWith('.dyn')) {
      setError('Only .dyn files are accepted');
      return;
    }
    setError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        onGraphLoaded(data, file.name);
      } catch {
        setError('Failed to parse file — is it a valid .dyn graph?');
      }
    };
    reader.onerror = () => {
      setError('Failed to read the file');
    };
    reader.readAsText(file);
  }, [onGraphLoaded]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current = 0;
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      readAndLoad(file);
    }
  }, [readAndLoad]);

  const handleFileInput = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      readAndLoad(file);
    }
    e.target.value = '';
  }, [readAndLoad]);

  return (
    <div className="home">
      <h1 className="home-title">Drop a graph, get a story!</h1>
      <p className="home-subtitle">
        Load a Dynamo <code>.dyn</code> graph to generate its story
      </p>

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

      {error && <p className="home-error">{error}</p>}

      {onBrowseLibrary && (
        <p className="home-library-link">
          or{' '}
          <button className="home-library-btn" onClick={onBrowseLibrary}>
            browse the library
          </button>
        </p>
      )}
    </div>
  );
}

export default Home;
