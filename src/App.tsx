import React, { useRef } from 'react';
import { BackgroundEffects } from './components/BackgroundEffects';
import { OpeningSection } from './components/OpeningSection';
import { CandleBlowGame } from './components/CandleBlowGame';
import { LifelineWheelGame } from './components/LifelineWheelGame';
import { BalloonPopGame } from './components/BalloonPopGame';
import { ScratchCardGame } from './components/ScratchCardGame';
import { CaptionsLibrary } from './components/CaptionsLibrary';
import { WishesWall } from './components/WishesWall';
import { EndingSection } from './components/EndingSection';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  const middleSectionRef = useRef<HTMLDivElement | null>(null);

  const handleStartExperience = () => {
    if (middleSectionRef.current) {
      middleSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#050010] bg-immersive-radial text-white font-sans selection:bg-pink-500 selection:text-white relative overflow-x-hidden">
        {/* Ambient Starfield & Floating Particle Background */}
        <BackgroundEffects />

        {/* Main Content Area */}
        <main className="relative z-10 flex flex-col items-center px-4">
          {/* 1. Opening Section */}
          <OpeningSection onStartExperience={handleStartExperience} />

          {/* 2. Middle Section: Tasks & Mini Games Container */}
          <div ref={middleSectionRef} className="w-full max-w-4xl flex flex-col items-center pt-8">
            {/* Task 1: Candle Blow Ceremony */}
            <CandleBlowGame />

            {/* Task 2: Lifeline Wheel Game */}
            <LifelineWheelGame />

            {/* Task 3: Balloon Pop Game */}
            <BalloonPopGame />

            {/* Task 4: Scratch Card Secret Letter */}
            <ScratchCardGame />

            {/* Task 5: Best Bangla Captions Library with Real-time Likes */}
            <CaptionsLibrary />

            {/* Task 6: Firebase Real-Time Wishes Wall */}
            <WishesWall />
          </div>

          {/* 3. Ending Section with Signature & Required Footer */}
          <EndingSection />
        </main>
      </div>
    </AuthProvider>
  );
}

