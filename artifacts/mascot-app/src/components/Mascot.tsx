import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type ReactionType = 
  | "idle" 
  | "excited" 
  | "thumbsUp" 
  | "celebrate" 
  | "thinking" 
  | "wave" 
  | "running" 
  | "skidding";

export type ModeType = "casual" | "corporate";

interface MascotProps {
  mode: ModeType;
  reaction: ReactionType;
  speechText?: string;
  className?: string;
}

export function Mascot({ mode, reaction, speechText, className = "" }: MascotProps) {
  const [showSpeech, setShowSpeech] = useState(false);

  useEffect(() => {
    if (speechText) {
      setShowSpeech(true);
    } else {
      setShowSpeech(false);
    }
  }, [speechText]);

  // Framer motion variants for the whole character container
  const containerVariants = {
    idle: { y: 0, scale: 1 },
    running: { x: [-500, 0], scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
    skidding: { x: [0, 20, -10, 0], rotate: [0, 15, -5, 0], transition: { duration: 0.5 } },
    excited: { y: [0, -30, 0], scale: [1, 1.1, 1], transition: { duration: 0.4, repeat: 2 } },
    thumbsUp: { scale: 1.05, transition: { duration: 0.3 } },
    celebrate: { y: [0, -40, 0], rotate: [0, 360], scale: [1, 1.2, 1], transition: { duration: 0.8 } },
    thinking: { y: -5, transition: { duration: 0.5 } },
    wave: { scale: 1 },
  };

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      
      {/* Speech Bubble */}
      <AnimatePresence>
        {showSpeech && speechText && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute -top-24 left-1/2 -translate-x-1/2 bg-white text-secondary px-6 py-4 rounded-2xl shadow-xl border border-gray-100 min-w-[220px] max-w-[280px] text-center font-medium z-50 text-sm"
          >
            {speechText}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-r-[10px] border-t-[14px] border-l-transparent border-r-transparent border-t-white drop-shadow-sm"></div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        className="relative z-10 mascot-idle-float w-64 h-64 flex items-center justify-center"
        variants={containerVariants}
        animate={reaction}
      >
        {reaction === 'celebrate' && (
          <div className="absolute inset-0 z-0 flex items-center justify-center">
            <div className="w-4 h-4 bg-accent rounded-full absolute top-0 right-10" style={{ animation: 'starBurst 0.8s ease-out' }} />
            <div className="w-3 h-3 bg-primary rounded-full absolute bottom-10 left-4" style={{ animation: 'starBurst 0.6s ease-out 0.2s' }} />
            <div className="w-5 h-5 bg-yellow-400 rounded-full absolute top-10 left-10" style={{ animation: 'starBurst 0.7s ease-out 0.1s' }} />
          </div>
        )}

        <svg viewBox="0 0 200 200" className="w-full h-full mascot-idle-body relative z-10" style={{ overflow: 'visible' }}>
          <defs>
            <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF8566" />
              <stop offset="100%" stopColor="#FF5029" />
            </linearGradient>
            <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.3)" />
            </linearGradient>
          </defs>

          {/* Legs */}
          <g>
            <path d="M 80,150 L 75,175 C 75,185 60,185 60,175 L 65,150 Z" fill="#1B2A4E" />
            <path d="M 120,150 L 125,175 C 125,185 140,185 140,175 L 135,150 Z" fill="#1B2A4E" />
            {/* Feet / Boots */}
            <ellipse cx="65" cy="180" rx="15" ry="8" fill="#FFB800" />
            <ellipse cx="135" cy="180" rx="15" ry="8" fill="#FFB800" />
          </g>

          {/* Body / Head (It's a round buddy) */}
          <circle cx="100" cy="100" r="60" fill="url(#bodyGrad)" />
          
          {/* Radar / Antenna on head */}
          <path d="M 100,40 L 100,20" stroke="#1B2A4E" strokeWidth="4" strokeLinecap="round" />
          <circle cx="100" cy="15" r="5" fill="#FFB800" className={reaction === 'excited' || reaction === 'celebrate' ? 'animate-pulse' : ''} />
          {reaction === 'celebrate' && (
             <path d="M 85,15 A 15,15 0 0,1 115,15 M 75,15 A 25,25 0 0,1 125,15" stroke="#FFB800" strokeWidth="3" fill="none" strokeLinecap="round" className="animate-ping" />
          )}

          {/* Visor / Face Area */}
          <rect x="55" y="70" width="90" height="50" rx="25" fill="url(#glassGrad)" stroke="#1B2A4E" strokeWidth="3" />

          {/* Eyes inside the visor */}
          <g className="mascot-idle-eyes">
            {reaction === 'thumbsUp' || reaction === 'celebrate' ? (
              // Happy / winking eyes
              <>
                <path d="M 70,95 Q 80,85 90,95" stroke="#1B2A4E" strokeWidth="4" fill="none" strokeLinecap="round" />
                <path d="M 110,95 Q 120,85 130,95" stroke="#1B2A4E" strokeWidth="4" fill="none" strokeLinecap="round" />
              </>
            ) : reaction === 'thinking' ? (
              // Thinking eyes (looking up right)
              <>
                <circle cx="85" cy="90" r="6" fill="#1B2A4E" />
                <circle cx="125" cy="90" r="6" fill="#1B2A4E" />
              </>
            ) : reaction === 'excited' ? (
              // Huge pupils
              <>
                <circle cx="80" cy="95" r="10" fill="#1B2A4E" />
                <circle cx="120" cy="95" r="10" fill="#1B2A4E" />
                <circle cx="78" cy="93" r="3" fill="white" />
                <circle cx="118" cy="93" r="3" fill="white" />
              </>
            ) : (
              // Normal eyes
              <>
                <circle cx="80" cy="95" r="8" fill="#1B2A4E" />
                <circle cx="120" cy="95" r="8" fill="#1B2A4E" />
                <circle cx="78" cy="92" r="2.5" fill="white" />
                <circle cx="118" cy="92" r="2.5" fill="white" />
              </>
            )}
          </g>

          {/* Smile / Mouth */}
          {(reaction === 'idle' || reaction === 'wave' || reaction === 'running') && (
            <path d="M 90,110 Q 100,115 110,110" stroke="#1B2A4E" strokeWidth="3" fill="none" strokeLinecap="round" />
          )}
          {(reaction === 'excited' || reaction === 'celebrate' || reaction === 'thumbsUp') && (
            <path d="M 85,108 Q 100,120 115,108 Z" fill="#1B2A4E" />
          )}
          {reaction === 'thinking' && (
            <path d="M 95,110 L 105,110" stroke="#1B2A4E" strokeWidth="3" fill="none" strokeLinecap="round" />
          )}

          {/* Arms */}
          <g>
            {/* Left Arm */}
            {reaction === 'thumbsUp' ? (
               // Thumbs up pose
               <path d="M 45,105 Q 20,105 25,85" stroke="#FF5029" strokeWidth="12" fill="none" strokeLinecap="round" />
            ) : reaction === 'thinking' ? (
               // Hand to chin
               <path d="M 45,105 Q 20,130 50,115" stroke="#FF5029" strokeWidth="12" fill="none" strokeLinecap="round" />
            ) : (
               // Normal resting arm
               <path d="M 45,105 Q 25,120 35,135" stroke="#FF5029" strokeWidth="12" fill="none" strokeLinecap="round" />
            )}

            {/* Right Arm */}
            {reaction === 'wave' || reaction === 'celebrate' ? (
               // Waving arm
               <g style={reaction === 'wave' ? { animation: 'waveArm 1s ease-in-out infinite', transformOrigin: '155px 105px' } : {}}>
                 <path d="M 155,105 Q 180,85 175,65" stroke="#FF5029" strokeWidth="12" fill="none" strokeLinecap="round" />
                 <circle cx="175" cy="65" r="8" fill="#1B2A4E" />
               </g>
            ) : reaction === 'excited' ? (
               // Holding route map
               <g>
                 <path d="M 155,105 Q 180,105 175,120" stroke="#FF5029" strokeWidth="12" fill="none" strokeLinecap="round" />
                 <rect x="165" y="110" width="25" height="30" fill="white" stroke="#1B2A4E" strokeWidth="2" rx="2" transform="rotate(15 165 110)" />
                 <path d="M 170,115 Q 175,130 185,125" stroke="#FFB800" strokeWidth="2" fill="none" transform="rotate(15 165 110)" />
                 <circle cx="185" cy="125" r="2" fill="#1B2A4E" transform="rotate(15 165 110)" />
                 <circle cx="175" cy="120" r="8" fill="#1B2A4E" />
               </g>
            ) : (
               // Normal resting arm
               <>
                 <path d="M 155,105 Q 175,120 165,135" stroke="#FF5029" strokeWidth="12" fill="none" strokeLinecap="round" />
                 <circle cx="165" cy="135" r="8" fill="#1B2A4E" />
               </>
            )}

            {/* Left Hand */}
            {reaction === 'thumbsUp' ? (
              <g transform="translate(25, 85)">
                <circle cx="0" cy="0" r="8" fill="#1B2A4E" />
                <rect x="-4" y="-12" width="6" height="8" rx="3" fill="#1B2A4E" />
              </g>
            ) : reaction === 'thinking' ? (
              <circle cx="50" cy="115" r="8" fill="#1B2A4E" />
            ) : (
              <circle cx="35" cy="135" r="8" fill="#1B2A4E" />
            )}
          </g>

          {/* Props: Question Mark */}
          {reaction === 'thinking' && (
            <text x="120" y="45" fontSize="30" fill="#1B2A4E" fontWeight="bold" fontFamily="sans-serif">?</text>
          )}

          {/* Corporate Mode Transformation: Tie & Jacket lines */}
          <AnimatePresence>
            {mode === 'corporate' && (
              <motion.g 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0 }}
              >
                {/* Tie */}
                <path d="M 95,125 L 105,125 L 102,150 L 100,155 L 98,150 Z" fill="#1B2A4E" />
                {/* Collar */}
                <path d="M 75,120 L 95,125 L 75,135 Z" fill="white" />
                <path d="M 125,120 L 105,125 L 125,135 Z" fill="white" />
              </motion.g>
            )}
          </AnimatePresence>
        </svg>
      </motion.div>

      {/* Shadow */}
      <div className="w-32 h-6 mascot-shadow mt-2" />
    </div>
  );
}
