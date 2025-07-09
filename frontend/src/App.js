import React, { useState, useEffect } from "react";
import styled, { ThemeProvider } from "styled-components";
import Game3D from "./components/Game3D";
import LetterPicker from "./components/LetterPicker";
import GameStatusBar from "./components/GameStatusBar";
import ScoreSidebar from "./components/ScoreSidebar";
import { WORDS } from "./words";
import { darkTheme } from "./theme";

// Helper to pick a random word/phrase
const getRandomWord = () => {
  const idx = Math.floor(Math.random() * WORDS.length);
  return WORDS[idx].toUpperCase();
};

const AppContainer = styled.div`
  display: flex;
  background: ${(props) => props.theme.primary};
  min-height: 100vh;
  height: 100vh;
  width: 100vw;
  justify-content: center;
  align-items: center;
`;

const GameWrapper = styled.div`
  background: rgba(44, 62, 80, 0.98);
  border-radius: 20px;
  padding: 32px 16px 16px 16px;
  box-shadow: 0 12px 32px -8px #000a, 0 0 0 2px rgba(236, 240, 241, 0.045);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  min-width: 680px;
  max-width: 860px;
  min-height: 720px;
  position: relative;
`;

const BottomBar = styled.div`
  margin-top: 24px;
`;

export default function App() {
  const [word, setWord] = useState(getRandomWord());
  const [revealed, setRevealed] = useState([]);
  const [selected, setSelected] = useState([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [score, setScore] = useState(0);
  const [gameStatus, setGameStatus] = useState("playing"); // 'playing' | 'won' | 'lost'
  const maxAttempts = 6;

  // Derive appearance for rendering
  useEffect(() => {
    // Check win condition (all unique non-space chars revealed)
    const isComplete = word
      .replace(/[^A-Z]/gi, "")
      .split("")
      .every((ch) => revealed.includes(ch));
    if (isComplete) {
      setGameStatus("won");
      setScore((s) => s + 1);
    } else if (wrongGuesses >= maxAttempts) {
      setGameStatus("lost");
    }
  }, [revealed, wrongGuesses, word]);

  // User picks a letter
  const handleLetterPick = (letter) => {
    if (gameStatus !== "playing" || selected.includes(letter)) return;
    setSelected((prev) => [...prev, letter]);
    if (word.includes(letter)) {
      setRevealed((prev) => [...prev, letter]);
    } else {
      setWrongGuesses((n) => n + 1);
    }
  };

  // Start new game state
  const handleRestart = () => {
    const nextWord = getRandomWord();
    setWord(nextWord);
    setRevealed([]);
    setSelected([]);
    setWrongGuesses(0);
    setGameStatus("playing");
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <AppContainer>
        <ScoreSidebar score={score} attempts={wrongGuesses} maxAttempts={maxAttempts} />
        <GameWrapper>
          <GameStatusBar
            status={gameStatus}
            word={word}
            revealed={revealed}
            onRestart={handleRestart}
            attempts={wrongGuesses}
            maxAttempts={maxAttempts}
          />
          <Game3D
            word={word}
            revealed={revealed}
            wrongGuesses={wrongGuesses}
            status={gameStatus}
          />
          <BottomBar>
            <LetterPicker
              selected={selected}
              onPick={handleLetterPick}
              disabled={gameStatus !== "playing"}
            />
          </BottomBar>
        </GameWrapper>
      </AppContainer>
    </ThemeProvider>
  );
}
