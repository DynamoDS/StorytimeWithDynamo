import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [status, setStatus] = useState('loading...');

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setStatus(data.status))
      .catch(() => setStatus('error'));
  }, []);

  return (
    <div className="app">
      <h1>Storytime with Dynamo</h1>
      <p>Server status: {status}</p>
    </div>
  );
}

export default App;
