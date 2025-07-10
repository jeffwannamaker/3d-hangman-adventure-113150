import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import { WORDS } from './words';
import Game3D from './components/Game3D';
import GameStatusBar from './components/GameStatusBar';
import LetterPicker from './components/LetterPicker';
import ScoreSidebar from './components/ScoreSidebar';

const MAX_ATTEMPTS = 6; // 6 wrong guesses = full hangman built

// Simple dark and light theme objects for styled-components
const lightTheme = {
  accent: "#e74c3c",
  primary: "#fff",
  secondary: "#282c34",
  gallowsWood: "#60523b",
  gallowsMetal: "#888c91",
  rope: "#cca36a",
  figureSkin: "#dedac9",
  letter: "#282c34",
  guessed: "#7f8c8d",
  background: "#f0f0f2",
  letterButton: "#f8f9fa",
  letterActive: "#282c34",
  letterWrong: "#e74c3c",
  lightning: "#f2faff",
  wind: "#9cd6fc"
};

const darkTheme = {
  accent: "#e74c3c",
  primary: "#23272f",
  secondary: "#ecf0f1",
  gallowsWood: "#60523b",
  gallowsMetal: "#888c91",
  rope: "#cca36a",
  figureSkin: "#dedac9",
  letter: "#ecf0f1",
  guessed: "#7f8c8d",
  background: "#2c3e50",
  letterButton: "#2c3e50",
  letterActive: "#ecf0f1",
  letterWrong: "#e74c3c",
  lightning: "#f2faff",
  wind: "#9cd6fc"
};

function pickWord() {
  // Pick a random word or phrase from WORDS and returns uppercased
  return WORDS[Math.floor(Math.random() * WORDS.length)].toUpperCase();
}

// PUBLIC_INTERFACE
function App() {
  // Theme management
  const [theme, setTheme] = useState('dark');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  const themeObject = theme === "dark" ? darkTheme : lightTheme;

  // Game state
  const [word, setWord] = useState('');
  const [revealed, setRevealed] = useState([]);
  const [picked, setPicked] = useState([]);
  const [wrong, setWrong] = useState(0);
  const [status, setStatus] = useState('playing');
  const [score, setScore] = useState(0);

  // On mount/start or restart game: reset everything
  const startGame = useCallback(() => {
    const newWord = pickWord();
    setWord(newWord);
    setRevealed(newWord === "" ? [] : ([" "]));
    setPicked([]);
    setWrong(0);
    setStatus("playing");
  }, []);

  useEffect(() => {
    startGame();
    // eslint-disable-next-line
  }, []);

  // Picking a letter
  const handlePick = ch => {
    if (picked.includes(ch) || status !== "playing") return;
    setPicked(prev => [...prev, ch]);
    // If correct
    if (word.includes(ch)) {
      setRevealed(prev => [...prev, ch]);
    } else {
      setWrong(prev => prev + 1);
    }
  };

  // Game status calculation (win/loss)
  useEffect(() => {
    if (!word) return;
    // Win: all non-space chars in revealed
    const uniqueLetters = new Set(word.replace(/\s/g, '').split(''));
    const currentlyRevealed = new Set(revealed);
    if ([...uniqueLetters].every(l => currentlyRevealed.has(l))) {
      setStatus("won");
      setScore(prev => prev + 1);
    } else if (wrong >= MAX_ATTEMPTS) {
      setStatus("lost");
    }
  }, [revealed, wrong, word]);

  // Handle theme toggle
  const toggleTheme = () => setTheme(t => (t === "dark" ? "light" : "dark"));

  // Show picked/disabled letters according to game status
  const lettersDisabled = status !== "playing";

  return (
    <div className="App" style={{ background: themeObject.background, color: themeObject.letter }}>
      <header className="App-header" style={{ background: "none", minHeight: 0, paddingTop: 24 }}>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        <div style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          marginTop: 18,
          flexWrap: "wrap"
        }}>
          <ScoreSidebar
            score={score}
            attempts={wrong}
            maxAttempts={MAX_ATTEMPTS}
            theme={themeObject}
          />
          <div>
            <GameStatusBar
              status={status}
              word={word}
              revealed={revealed}
              onRestart={() => { setScore(0); startGame(); }}
              attempts={wrong}
              maxAttempts={MAX_ATTEMPTS}
              theme={themeObject}
            />
            <Game3D
              word={word}
              revealed={revealed}
              wrongGuesses={wrong}
              status={status}
              theme={themeObject}
            />
            <div style={{ marginTop: 28 }}>
              <LetterPicker
                selected={picked}
                onPick={handlePick}
                disabled={lettersDisabled}
                theme={themeObject}
              />
            </div>
          </div>
        </div>
        {status === "lost" && (
          <div style={{
            color: "#e74c3c", fontWeight: 700, fontSize: 18,
            marginTop: 34, textShadow: "0 2px 16px #c0392bd4"
          }}>
            The word was: <span style={{ textDecoration: "underline" }}>{word}</span>
          </div>
        )}
        <div style={{ marginTop: 40, color: "#9da6bc", fontSize: 15, opacity: 0.6 }}>
          3D Hangman Adventure &copy; KAVIA | Lightning & Wind Effects
        </div>
      </header>
    </div>
  );
}

export default App;
