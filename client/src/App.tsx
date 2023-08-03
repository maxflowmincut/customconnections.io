import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectIsDarkMode } from './core/darkModeSlice';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CreateGamePage from './pages/CreateGamePage';
import PlayGamePage from './pages/PlayGamePage';
import NotFoundPage from './pages/NotFoundPage';
import CustomGamePage from './pages/CustomGamePage';

function App() {
  const isDarkMode = useSelector(selectIsDarkMode);

  useEffect(() => {
    document.documentElement.dataset.theme = isDarkMode ? 'dark' : 'light';
  }, [isDarkMode]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create/game" element={<CreateGamePage />} />
        <Route path="/play/classic" element={<PlayGamePage />} />
        <Route path="/game/:gameId" element={<CustomGamePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;