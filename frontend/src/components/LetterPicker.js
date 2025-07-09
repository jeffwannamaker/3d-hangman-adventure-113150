import React from "react";
import styled from "styled-components";

const KeyboardWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 9px;
  margin-bottom: 0;
`;

const LetterButton = styled.button`
  width: 37px;
  height: 42px;
  margin: 2px 2.5px;
  background: ${(props) =>
    props.disabled
      ? (props.theme.letterWrong || "#e74c3c")
      : (props.selected
        ? props.theme.guessed
        : props.theme.letterButton)};
  color: ${(props) => props.theme.letter};
  border: none;
  border-radius: 8px;
  font-size: 1.12em;
  font-weight: bold;
  cursor: ${(props) =>
    props.disabled || props.selected ? "not-allowed" : "pointer"};
  opacity: ${(props) =>
    props.disabled
      ? 0.38
      : props.selected
        ? 0.65
        : 0.99};
  transition: all 0.14s;
  box-shadow: 0 1.2px 6px -1px #0006;
  &:hover {
    background: ${(props) =>
      !props.disabled && !props.selected
        ? props.theme.accent
        : ""};
  }
`;

const ALPHABET = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];

export default function LetterPicker({ selected, onPick, disabled }) {
  return (
    <KeyboardWrapper>
      {ALPHABET.map((ch) => (
        <LetterButton
          key={ch}
          onClick={() => onPick(ch)}
          selected={selected.includes(ch)}
          disabled={disabled || selected.includes(ch)}
          aria-label={`Pick letter ${ch}`}
        >
          {ch}
        </LetterButton>
      ))}
    </KeyboardWrapper>
  );
}
