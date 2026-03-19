import { useState, useEffect } from 'react';
import { playLullaby, stopLullaby, playPageTurn, speakAsGandalf } from './sounds';
import './App.css';

function App() {
  const [status, setStatus] = useState('loading...');
  const [lullabyOn, setLullabyOn] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setStatus(data.status))
      .catch(() => setStatus('error'));
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

  return (
    <div className="app">
      <h1>Storytime with Dynamo</h1>
      <p>Server status: {status}</p>
      <div className="controls">
        <button onClick={toggleLullaby}>
          {lullabyOn ? 'Stop Lullaby' : 'Play Lullaby'}
        </button>
        <button onClick={playPageTurn}>
          Turn Page
        </button>
        <button onClick={handleNarrate} disabled={speaking}>
          {speaking ? 'Narrating...' : 'Narrate'}
        </button>
      </div>
    </div>
  );
}

export default App;
