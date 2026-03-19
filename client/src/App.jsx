import { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Stories from './pages/Stories';
import Characters from './pages/Characters';
import Settings from './pages/Settings';
import './App.css';

const libraryItems = [
  { id: 'home', label: 'Home', icon: '\u2302' },
  { id: 'stories', label: 'Stories', icon: '\uD83D\uDCD6' },
  { id: 'characters', label: 'Characters', icon: '\uD83E\uDDD9' },
  { id: 'settings', label: 'Settings', icon: '\u2699' },
];

function App() {
  const [activePage, setActivePage] = useState('home');
  const [graphData, setGraphData] = useState(null);
  const [graphName, setGraphName] = useState(null);

  const handleGraphLoaded = useCallback((data, fileName) => {
    setGraphData(data);
    setGraphName(fileName);
    setActivePage('stories');
  }, []);

  const pages = {
    home: <Home onGraphLoaded={handleGraphLoaded} />,
    stories: <Stories graphData={graphData} graphName={graphName} />,
    characters: <Characters />,
    settings: <Settings />,
  };

  return (
    <div className="app">
      <Sidebar
        items={libraryItems}
        activeItem={activePage}
        onSelect={setActivePage}
      />
      <main className="content">
        {pages[activePage]}
      </main>
    </div>
  );
}

export default App;
