'use client';
import { useState, useEffect } from 'react';

export default function SplashScreen() {
  const [stage, setStage] = useState('visible'); // 'visible', 'fading', 'hidden'

  useEffect(() => {
    // Hold the splash screen for 2 seconds, then start fading
    const fadeTimer = setTimeout(() => {
      setStage('fading');
    }, 2000);

    // After 2.5 seconds (0.5s fade out), hide it completely
    const hideTimer = setTimeout(() => {
      setStage('hidden');
    }, 2500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (stage === 'hidden') return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0, left: 0, width: '100vw', height: '100vh',
        backgroundColor: 'var(--accent-primary)', // Deep blue
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: stage === 'visible' ? 1 : 0,
        transition: 'opacity 0.5s ease-in-out',
        pointerEvents: stage === 'visible' ? 'all' : 'none'
      }}
    >
      <div 
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          animation: 'pulse 1.5s infinite alternate'
        }}
      >
        {/* We can use CSS animation for a professional pop-in effect */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes splashPop {
            0% { transform: scale(0.9); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes pulse {
            0% { transform: scale(1); }
            100% { transform: scale(1.05); }
          }
        `}} />
        <h1 
          style={{
            color: 'white',
            fontSize: '3.5rem',
            fontWeight: '800',
            letterSpacing: '-1px',
            margin: 0,
            textShadow: '0 4px 12px rgba(0,0,0,0.2)',
            animation: 'splashPop 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards'
          }}
        >
          Skripsian Yuk
        </h1>
        <div style={{
          marginTop: '1rem',
          width: '50px',
          height: '4px',
          backgroundColor: 'white',
          borderRadius: '2px',
          opacity: 0.8,
          animation: 'splashPop 1s cubic-bezier(0.16, 1, 0.3, 1) forwards 0.2s'
        }}></div>
      </div>
    </div>
  );
}
