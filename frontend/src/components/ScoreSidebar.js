import React from "react";
import styled from "styled-components";
import { FiHeart } from "react-icons/fi";

const Sidebar = styled.div`
  width: 110px;
  min-width: 95px;
  margin-right: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(44, 62, 80, 0.12);
  border-radius: 18px;
  padding: 16px 8px;
  box-shadow: 0 8px 28px -10px #0003;
  font-size: 1.04em;
  color: ${(props) => props.theme.secondary};
  height: 98%;
`;

const Score = styled.div`
  font-size: 2em;
  margin-bottom: 18px;
  color: ${(props) => props.theme.accent};
  font-weight: bold;
  text-shadow: 1px 1px 6px #0006;
`;

const AttemptsLabel = styled.div`
  margin-top: 10px;
  margin-bottom: 2px;
  color: ${(props) => props.theme.letter};
  font-size: 1.1em;
`;

const Hearts = styled.div`
  margin-bottom: 12px;
  display: flex;
  gap: 0.2em;
`;

export default function ScoreSidebar({ score, attempts, maxAttempts }) {
  const remaining = maxAttempts - attempts;
  return (
    <Sidebar>
      <Score>{score}</Score>
      <div style={{ fontWeight: 500, marginBottom: 8 }}>Score</div>
      <AttemptsLabel>Attempts</AttemptsLabel>
      <Hearts>
        {[...Array(maxAttempts)].map((_, idx) => (
          <FiHeart
            key={idx}
            size={22}
            color={idx < remaining ? "#e74c3c" : "#555c67"}
            fill={idx < remaining ? "#e74c3c" : "#555c67"}
            style={{ opacity: idx < remaining ? 1 : 0.22 }}
          />
        ))}
      </Hearts>
      <div style={{ fontSize: 12, color: "#9da6bc", marginTop: "auto" }}>
        <span role="img" aria-label="tip">💡</span> 
        Max {maxAttempts}
      </div>
    </Sidebar>
  );
}
