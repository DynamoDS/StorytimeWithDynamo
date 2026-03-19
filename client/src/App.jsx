import { useState } from 'react';
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

const pages = {
  home: Home,
  stories: Stories,
  characters: Characters,
  settings: Settings,
};

function App() {
  const [activePage, setActivePage] = useState('home');
  const ActiveComponent = pages[activePage];

  return (
    <div className="app">
      <Sidebar
        items={libraryItems}
        activeItem={activePage}
        onSelect={setActivePage}
      />
      <main className="content">
        <ActiveComponent />
      </main>
    </div>
  );
}

export default App;
