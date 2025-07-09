import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stage, PerspectiveCamera, Html } from "@react-three/drei";
import * as THREE from "three";
import styled from "styled-components";

// Helper for lightning event
function useLightning(delayMin = 4000, delayMax = 12000) {
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    let running = true;
    function triggerFlash() {
      if (!running) return;
      setFlash(true);
      setTimeout(() => setFlash(false), 270 + Math.random() * 100);
      setTimeout(() => {
        if (running) triggerFlash();
      }, delayMin + Math.random() * (delayMax - delayMin));
    }
    const initial = setTimeout(triggerFlash, 800 + Math.random() * 2000);
    return () => { running = false; clearTimeout(initial); };
  }, [delayMin, delayMax]);
  return flash;
}

// Hangman figure as group of parts, revealed by stage
function Hangman({ stage = 0, wind = 0 }) {
  // swing via wind param
  const group = useRef();
  useFrame(() => {
    if (group.current) {
      group.current.rotation.z = Math.sin(window.performance.now() / 1300) * 0.04 + wind * 0.09;
    }
  });

  // Drawing reference: head->body->left arm->right arm->left leg->right leg
  return (
    <group ref={group} position={[0, -0.7, 0]}>
      {/* Head */}
      {stage >= 1 && (
        <mesh castShadow position={[0, 0.67, 0]}>
          <sphereGeometry args={[0.18, 22, 22]} />
          <meshStandardMaterial color="#dedac9" />
        </mesh>
      )}
      {/* Body */}
      {stage >= 2 && (
        <mesh castShadow position={[0, 0.31, 0]}>
          <cylinderGeometry args={[0.12, 0.16, 0.43, 11]} />
          <meshStandardMaterial color="#dedac9" />
        </mesh>
      )}
      {/* Left Arm */}
      {stage >= 3 && (
        <mesh castShadow position={[-0.18, 0.385, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.35, 10]} />
          <meshStandardMaterial color="#dedac9" />
          <mesh rotation={[0, 0, Math.PI / 3]} position={[0, -0.15, 0]} />
        </mesh>
      )}
      {/* Right Arm */}
      {stage >= 4 && (
        <mesh castShadow position={[0.18, 0.385, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.35, 10]} />
          <meshStandardMaterial color="#dedac9" />
          <mesh rotation={[0, 0, -Math.PI / 3]} position={[0, -0.15, 0]} />
        </mesh>
      )}
      {/* Left Leg */}
      {stage >= 5 && (
        <mesh castShadow position={[-0.09, -0.13, 0]}>
          <cylinderGeometry args={[0.045, 0.045, 0.44, 9]} />
          <meshStandardMaterial color="#dedac9" />
          <mesh rotation={[0, 0, Math.PI / 4]} position={[0, -0.22, 0]} />
        </mesh>
      )}
      {/* Right Leg */}
      {stage >= 6 && (
        <mesh castShadow position={[0.09, -0.13, 0]}>
          <cylinderGeometry args={[0.045, 0.045, 0.44, 9]} />
          <meshStandardMaterial color="#dedac9" />
          <mesh rotation={[0, 0, -Math.PI / 4]} position={[0, -0.22, 0]} />
        </mesh>
      )}
    </group>
  );
}

// Gallows geometry (wood/metal, rope)
function Gallows() {
  return (
    <group>
      {/* Upright Post */}
      <mesh position={[-0.45, 0.27, 0]}>
        <boxGeometry args={[0.10, 1.18, 0.10]} />
        <meshStandardMaterial color="#60523b" roughness={0.47} />
      </mesh>
      {/* Top Beam */}
      <mesh position={[0, 0.83, 0]}>
        <boxGeometry args={[0.68, 0.11, 0.11]} />
        <meshStandardMaterial color="#60523b" roughness={0.40} />
      </mesh>
      {/* Support Beam */}
      <mesh position={[-0.27, 0.54, 0]}>
        <boxGeometry args={[0.36, 0.065, 0.065]} />
        <meshStandardMaterial color="#888c91" />
      </mesh>
      {/* Rope */}
      <mesh position={[0.23, 0.67, 0]}>
        <cylinderGeometry args={[0.023, 0.020, 0.36, 13]} />
        <meshStandardMaterial color="#cca36a" />
      </mesh>
      {/* Floor Base */}
      <mesh position={[-0.20, -0.41, 0]}>
        <boxGeometry args={[0.98, 0.095, 0.19]} />
        <meshStandardMaterial color="#5a4d38" roughness={0.52} />
      </mesh>
    </group>
  );
}

// Lightning effect: simulates a scene-wide flash
function LightningEffect({ active }) {
  return active ? (
    <mesh position={[0, 0.25, -1]}>
      <planeGeometry args={[4.4, 3.0]} />
      <meshBasicMaterial color="#f2faff" transparent opacity={0.23 + Math.random() * 0.2} />
    </mesh>
  ) : null;
}

// Wind effect: causes hangman to briefly swing back/forth
function useWindGust() {
  const [wind, setWind] = useState(0);
  useEffect(() => {
    let timer = null, gustTimer = null;
    function triggerGust() {
      const dir = Math.random() < 0.5 ? -1 : 1;
      setWind(dir * (0.18 + Math.random() * 0.16));
      gustTimer = setTimeout(() => setWind(0), 1500 + Math.random()*500);
      timer = setTimeout(triggerGust, 6100 + Math.random()*6500);
    }
    timer = setTimeout(triggerGust, 4000 + Math.random()*4000);
    return () => {
      clearTimeout(timer);
      clearTimeout(gustTimer);
    };
  }, []);
  return wind;
}

/**
 * PUBLIC_INTERFACE
 * Game3D renders the 3D scene (gallows, hangman, storm effects) based on wrong guesses.
 * @param {string} word
 * @param {array} revealed
 * @param {number} wrongGuesses
 * @param {string} status - game status: "playing"|"won"|"lost"
 */
export default function Game3D({ word, revealed, wrongGuesses, status }) {
  const lightning = useLightning();
  const wind = useWindGust();
  return (
    <div style={{ width: "510px", height: "380px", background: "#171820bb", borderRadius: 15, margin: "0 auto", boxShadow: "0 10px 44px 1px #111c", position: "relative" }}>
      <Canvas shadows dpr={window.devicePixelRatio || 1.5}>
        <color attach="background" args={["#21222a"]} />
        <ambientLight intensity={0.25} />
        <pointLight position={[2, 2, 2]} intensity={0.32} castShadow />
        {/* Lightning */}
        {lightning && <directionalLight color="#f2faff" intensity={2.9} position={[-2, 3, .5]} />}
        {/* Storm flashes */}
        <LightningEffect active={lightning} />
        <Stage intensity={0.33} shadows={{ type: "accumulative", color: "#333", colorBlend: 2.2, opacity: 0.11 }}>
          <PerspectiveCamera makeDefault position={[2.5, 1.6, 3.2]} fov={38} />
          <Gallows />
          {/* Animate hangman as wind and stage increases */}
          <group position={[0.23, 0.49, 0]}>
            <Hangman stage={wrongGuesses} wind={wind} />
          </group>
        </Stage>
      </Canvas>
      {/* Visual overlays and effects */}
      <Html center style={{
        pointerEvents: "none",
        width: "100%",
        textAlign: "center",
        top: "-7px",
        fontFamily: "'Fira Code', monospace",
        fontSize: 12,
        fontWeight: 500,
        color: "#60acffbb",
        opacity: lightning ? 0.92 : 0.73,
        filter: lightning ? "drop-shadow(0 0 12px #f8fbff)" : undefined,
        transition: "opacity 0.18s"
      }}>
        {lightning && "⚡ LIGHTNING ⚡"}
        {wind !== 0 && !lightning && "💨 WIND GUST 💨"}
      </Html>
    </div>
  );
}
