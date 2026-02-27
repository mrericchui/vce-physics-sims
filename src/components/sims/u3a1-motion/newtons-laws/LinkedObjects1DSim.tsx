import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, RotateCcw, Info } from 'lucide-react';

export default function LinkedObjects1DSim() {
  const [m1, setM1] = useState(10); // kg
  const [m2, setM2] = useState(5);  // kg
  const [force, setForce] = useState(30); // N
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [velocity, setVelocity] = useState(0);
  
  const requestRef = useRef<number>(null);
  const lastUpdateTimeRef = useRef<number>(null);

  const acceleration = force / (m1 + m2);
  const tension = m1 * acceleration; // Force on the trailing mass (m1)

  const animate = (time: number) => {
    if (lastUpdateTimeRef.current !== undefined) {
      const deltaTime = (time - lastUpdateTimeRef.current) / 1000;
      
      setVelocity(prev => prev + acceleration * deltaTime);
      setPosition(prev => prev + velocity * deltaTime + 0.5 * acceleration * deltaTime * deltaTime);
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
  }, [isPlaying, velocity, acceleration]);

  const handleReset = () => {
    setIsPlaying(false);
    setPosition(0);
    setVelocity(0);
  };

  return (
    <div className="w-full h-full flex flex-col p-8 gap-8">
      {/* Simulation Area */}
      <div className="flex-1 glass-panel rounded-3xl relative overflow-hidden bg-slate-950/50 border-white/5">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full max-w-2xl h-1 bg-white/10">
            {/* Mass 1 (Trailing) */}
            <motion.div 
              style={{ x: position * 50 }}
              className="absolute bottom-0 -translate-x-[120px] w-20 h-20 bg-slate-800 border-2 border-slate-700 rounded-lg flex items-center justify-center"
            >
              <span className="text-white font-black">m₁</span>
              <div className="absolute -top-6 text-[10px] font-bold text-slate-500 uppercase">Trailing</div>
            </motion.div>

            {/* String */}
            <motion.div 
              style={{ x: position * 50 }}
              className="absolute bottom-10 -translate-x-[40px] w-10 h-0.5 bg-gold/50"
            />

            {/* Mass 2 (Leading) */}
            <motion.div 
              style={{ x: position * 50 }}
              className="absolute bottom-0 -translate-x-[30px] w-20 h-20 bg-gold/20 border-2 border-gold/50 rounded-lg flex items-center justify-center"
            >
              <span className="text-gold font-black">m₂</span>
              <div className="absolute -top-6 text-[10px] font-bold text-gold uppercase">Leading</div>
            </motion.div>

            {/* Force Arrow */}
            <motion.div 
              style={{ x: position * 50 }}
              className="absolute bottom-10 left-[55px] flex items-center"
            >
              <div className="h-1 bg-emerald-500" style={{ width: force * 2 }} />
              <div className="w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-[8px] border-l-emerald-500" />
              <div className="absolute left-full ml-2 text-emerald-500 font-black text-sm">F = {force}N</div>
            </motion.div>
          </div>
        </div>

        {/* Real-time Stats Overlay */}
        <div className="absolute top-6 right-6 flex flex-col gap-2">
          <div className="glass-panel px-4 py-2 rounded-xl border-white/5 flex justify-between gap-8">
            <span className="text-xs font-bold text-slate-500 uppercase">Acceleration</span>
            <span className="text-sm font-black text-gold">{acceleration.toFixed(2)} m/s²</span>
          </div>
          <div className="glass-panel px-4 py-2 rounded-xl border-white/5 flex justify-between gap-8">
            <span className="text-xs font-bold text-slate-500 uppercase">Tension</span>
            <span className="text-sm font-black text-emerald-500">{tension.toFixed(2)} N</span>
          </div>
          <div className="glass-panel px-4 py-2 rounded-xl border-white/5 flex justify-between gap-8">
            <span className="text-xs font-bold text-slate-500 uppercase">Velocity</span>
            <span className="text-sm font-black text-white">{velocity.toFixed(2)} m/s</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="glass-panel rounded-3xl p-8 flex items-center justify-between border-white/5">
        <div className="flex gap-12">
          <div className="space-y-4">
            <div className="flex justify-between">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Mass 1 (kg)</label>
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
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Mass 2 (kg)</label>
              <span className="text-xs font-black text-white">{m2}</span>
            </div>
            <input 
              type="range" min="1" max="50" value={m2} 
              onChange={(e) => setM2(Number(e.target.value))}
              className="w-48 accent-gold"
            />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Applied Force (N)</label>
              <span className="text-xs font-black text-white">{force}</span>
            </div>
            <input 
              type="range" min="0" max="200" value={force} 
              onChange={(e) => setForce(Number(e.target.value))}
              className="w-48 accent-emerald-500"
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
