import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw } from 'lucide-react';

export default function PulleySystemSim() {
  const [m1, setM1] = useState(10); // kg (on table)
  const [m2, setM2] = useState(5);  // kg (hanging)
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [velocity, setVelocity] = useState(0);
  
  const g = 9.8;
  const acceleration = (m2 * g) / (m1 + m2);
  const tension = m1 * acceleration;

  const requestRef = useRef<number>(null);
  const lastUpdateTimeRef = useRef<number>(null);

  const animate = (time: number) => {
    if (lastUpdateTimeRef.current !== undefined) {
      const deltaTime = (time - lastUpdateTimeRef.current) / 1000;
      
      // Stop if m2 hits the ground or m1 hits the pulley
      if (position < 4) {
        setVelocity(prev => prev + acceleration * deltaTime);
        setPosition(prev => prev + velocity * deltaTime);
      } else {
        setIsPlaying(false);
      }
    }
    lastUpdateTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (isPlaying) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      lastUpdateTimeRef.current = undefined;
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, velocity, acceleration, position]);

  const handleReset = () => {
    setIsPlaying(false);
    setPosition(0);
    setVelocity(0);
  };

  return (
    <div className="w-full h-full flex flex-col p-8 gap-8">
      <div className="flex-1 glass-panel rounded-3xl relative overflow-hidden bg-slate-950/50 border-white/5">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-[600px] h-[400px]">
            {/* Table */}
            <div className="absolute top-[150px] left-0 w-[400px] h-2 bg-white/10" />
            
            {/* Pulley */}
            <div className="absolute top-[140px] left-[400px] w-6 h-6 rounded-full border-2 border-gold flex items-center justify-center">
              <div className="w-1 h-1 bg-gold rounded-full" />
            </div>

            {/* Mass 1 (on table) */}
            <motion.div 
              style={{ left: 100 + position * 60 }}
              className="absolute top-[70px] w-20 h-20 bg-slate-800 border-2 border-slate-700 rounded-lg flex items-center justify-center"
            >
              <span className="text-white font-black">m₁</span>
            </motion.div>

            {/* Horizontal String */}
            <motion.div 
              style={{ left: 180 + position * 60, width: 220 - position * 60 }}
              className="absolute top-[110px] h-0.5 bg-gold/50"
            />

            {/* Vertical String */}
            <motion.div 
              style={{ top: 150, height: 50 + position * 60 }}
              className="absolute left-[411px] w-0.5 bg-gold/50"
            />

            {/* Mass 2 (hanging) */}
            <motion.div 
              style={{ top: 200 + position * 60 }}
              className="absolute left-[371px] w-20 h-20 bg-gold/20 border-2 border-gold/50 rounded-lg flex items-center justify-center"
            >
              <span className="text-gold font-black">m₂</span>
            </motion.div>
          </div>
        </div>

        {/* Stats */}
        <div className="absolute top-6 right-6 flex flex-col gap-2">
          <div className="glass-panel px-4 py-2 rounded-xl border-white/5 flex justify-between gap-8">
            <span className="text-xs font-bold text-slate-500 uppercase">Acceleration</span>
            <span className="text-sm font-black text-gold">{acceleration.toFixed(2)} m/s²</span>
          </div>
          <div className="glass-panel px-4 py-2 rounded-xl border-white/5 flex justify-between gap-8">
            <span className="text-xs font-bold text-slate-500 uppercase">Tension</span>
            <span className="text-sm font-black text-emerald-500">{tension.toFixed(2)} N</span>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-3xl p-8 flex items-center justify-between border-white/5">
        <div className="flex gap-12">
          <div className="space-y-4">
            <div className="flex justify-between">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Mass 1 (Table) kg</label>
              <span className="text-xs font-black text-white">{m1}</span>
            </div>
            <input 
              type="range" min="1" max="50" value={m1} 
              onChange={(e) => setM1(Number(e.target.value))}
              className="w-48 accent-gold"
            />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Mass 2 (Hanging) kg</label>
              <span className="text-xs font-black text-white">{m2}</span>
            </div>
            <input 
              type="range" min="1" max="50" value={m2} 
              onChange={(e) => setM2(Number(e.target.value))}
              className="w-48 accent-gold"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-14 h-14 rounded-2xl bg-gold text-black flex items-center justify-center hover:scale-105 transition-transform active:scale-95"
          >
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
          </button>
          <button 
            onClick={handleReset}
            className="w-14 h-14 rounded-2xl bg-white/5 text-white flex items-center justify-center hover:bg-white/10 transition-all active:scale-95"
          >
            <RotateCcw size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
