import React from "react";
import styled, { keyframes } from "styled-components";

const pulse = keyframes`
  0% { text-shadow: 0 0 8px #e74c3c55, 0 0 2px #fff2; }
  100% { text-shadow: 0 0 16px #e74c3c, 0 0 8px #fff6; }
`;

const StatusContainer = styled.div`
  text-align: center;
  margin-bottom: 0.5em;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PhraseReveal = styled.div`
  font-size: 1.6em;
  letter-spacing: .166em;
  padding: 12px 8px 10px 8px;
  margin: 0;
  background: rgba(34,40,48,0.55);
  border-radius: 10px;
  color: ${(props) => props.theme.letter};
  font-family: 'Fira Mono', monospace;
  word-break: break-word;
  margin-bottom: 8px;
  min-height: 48px;
`;

const AnimatedWin = styled.div`
  color: #5dffb7;
  font-weight: bold;
  font-size: 1.6em;
  margin-bottom: 6px;
  animation: ${pulse} .6s alternate infinite;
  filter: drop-shadow(0 0 12px #7cffa690);
`;

const AnimatedLose = styled.div`
  color: #e74c3c;
  font-weight: 700;
  font-size: 1.3em;
  margin-bottom: 4px;
  animation: ${pulse} .6s alternate infinite;
`;

const RestartButton = styled.button`
  background: ${(props) => props.theme.accent};
  color: ${(props) => props.theme.primary};
  font-weight: bold;
  border: none;
  border-radius: 9px;
  padding: 8px 26px;
  font-size: 1.07em;
  margin-top: 1.5em;
  box-shadow: 0 2px 12px -2px #0001;
  transition: background 0.12s;
  cursor: pointer;
  &:hover { background: #c0392b; }
`;

export default function GameStatusBar({ status, word, revealed, onRestart, attempts, maxAttempts }) {
  // Reveal phrase with unguessed letters as "_"
  const display = word.split("").map((ch, idx) => {
    if (ch === " ") return " "; // preserve spaces
    return revealed.includes(ch) ? ch : "_";
  }).join(" ");

  return (
    <StatusContainer>
      {status === "won" && <AnimatedWin>You Won! 🎉</AnimatedWin>}
      {status === "lost" && <AnimatedLose>Game Over</AnimatedLose>}
      <PhraseReveal>{display}</PhraseReveal>
      {status !== "playing" && (
        <RestartButton onClick={onRestart}>
          New Word
        </RestartButton>
      )}
    </StatusContainer>
  );
}
