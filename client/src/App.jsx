import { useState, useCallback } from 'react';
import { playLullaby, stopLullaby, playPageTurn, speakAsGandalf } from './sounds';
import Library from './components/Library';
import BookCover from './components/BookCover';
import BookReader from './components/BookReader';
import BookResult from './components/BookResult';
import { SAMPLE_STEPS } from './data/sampleSteps';
import './App.css';

function App() {
  const [screen, setScreen] = useState('library');
  const [selectedBook, setSelectedBook] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [lullabyOn, setLullabyOn] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const handleBookSelect = useCallback((book) => {
    setSelectedBook(book);
    setScreen('cover');
  }, []);

  const handleOpenBook = useCallback(() => {
    setCurrentStep(0);
    setScreen('reader');
  }, []);

  const handleJumpTo = useCallback((stepIndex) => {
    setCurrentStep(stepIndex);
    setScreen('reader');
  }, []);

  const handleStepChange = useCallback((newStep) => {
    setCurrentStep(newStep);
  }, []);

  const handleFinish = useCallback(() => {
    setScreen('result');
  }, []);

  const handleReadAgain = useCallback(() => {
    setCurrentStep(0);
    setScreen('reader');
  }, []);

  const handleBackToLibrary = useCallback(() => {
    setSelectedBook(null);
    setScreen('library');
  }, []);

  function toggleLullaby() {
    if (lullabyOn) {
      stopLullaby();
    } else {
      playLullaby();
    }
    setLullabyOn(!lullabyOn);
  }

  async function handleNarrate() {
    setSpeaking(true);
    await speakAsGandalf('It was the best of times. It was the worst of times.');
    setSpeaking(false);
  }

  // For now, all books use the same sample steps
  const steps = SAMPLE_STEPS;

  return (
    <div className="app">
      {screen === 'library' && (
        <Library onBookSelect={handleBookSelect} />
      )}
      {screen === 'cover' && selectedBook && (
        <BookCover
          book={selectedBook}
          steps={steps}
          onBack={handleBackToLibrary}
          onOpenBook={handleOpenBook}
          onJumpTo={handleJumpTo}
        />
      )}
      {screen === 'reader' && selectedBook && (
        <BookReader
          book={selectedBook}
          steps={steps}
          currentStep={currentStep}
          onStepChange={handleStepChange}
          onBack={() => setScreen('cover')}
          onFinish={handleFinish}
          onPageTurn={playPageTurn}
          onNarrate={speakAsGandalf}
        />
      )}
      {screen === 'result' && selectedBook && (
        <BookResult
          book={selectedBook}
          totalSteps={steps.length}
          onReadAgain={handleReadAgain}
          onBackToLibrary={handleBackToLibrary}
        />
      )}
      <div className="audio-controls">
        <button className={`audio-btn lullaby-toggle ${lullabyOn ? 'active' : ''}`} onClick={toggleLullaby}>
          {lullabyOn ? '\u23F9' : '\u266B'}
          <span className="audio-btn-label">{lullabyOn ? 'Stop Lullaby' : 'Lullaby'}</span>
        </button>
        <button className="audio-btn" onClick={handleNarrate} disabled={speaking} title="Narrate">
          {speaking ? '\uD83D\uDDE3\uFE0F' : '\uD83E\uDDD9'}
        </button>
      </div>
    </div>
  );
}

export default App;
