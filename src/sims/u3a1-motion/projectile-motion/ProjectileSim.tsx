import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Info, Target, ArrowUp, ArrowRight } from 'lucide-react';
import { cn } from '../../../utils';

export default function ProjectileSim() {
  const [v0, setV0] = useState(20); // m/s
  const [angle, setAngle] = useState(45); // degrees
  const [h0, setH0] = useState(0); // m
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  
  const g = 9.8;
  const angleRad = (angle * Math.PI) / 180;
  const vx = v0 * Math.cos(angleRad);
  const vy0 = v0 * Math.sin(angleRad);

  // Calculated stats
  const timeToPeak = vy0 / g;
  const maxHeight = h0 + (vy0 * vy0) / (2 * g);
  
  // Quadratic formula for total time: h0 + vy0*t - 0.5*g*t^2 = 0
  // 0.5gt^2 - vy0t - h0 = 0
  const totalTime = (vy0 + Math.sqrt(vy0 * vy0 + 2 * g * h0)) / g;
  const range = vx * totalTime;

  const requestRef = useRef<number>(null);
  const lastUpdateTimeRef = useRef<number>(null);

  const animate = (t: number) => {
    if (lastUpdateTimeRef.current !== undefined) {
      const deltaTime = (t - lastUpdateTimeRef.current) / 1000;
      setTime(prev => {
        const nextTime = prev + deltaTime;
        if (nextTime >= totalTime) {
          setIsPlaying(false);
          return totalTime;
        }
        return nextTime;
      });
    }
    lastUpdateTimeRef.current = t;
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
  }, [isPlaying]);

  const handleReset = () => {
    setIsPlaying(false);
    setTime(0);
  };

  // Current state
  const curX = vx * time;
  const curY = h0 + vy0 * time - 0.5 * g * time * time;
  const curVy = vy0 - g * time;
  const curV = Math.sqrt(vx * vx + curVy * curVy);

  // Scaling for visual
  const scale = 15; // pixels per meter
  const visualX = curX * scale;
  const visualY = curY * scale;
  const visualH0 = h0 * scale;

  return (
    <div className="w-full h-full flex flex-col p-8 gap-8">
      <div className="flex-1 glass-panel rounded-3xl relative overflow-hidden bg-slate-950/50 border-white/5">
        {/* Ground */}
        <div className="absolute bottom-20 left-0 w-full h-1 bg-white/10" />
        
        {/* Trajectory Path (approximate) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <path
            d={`M 100 ${600 - visualH0} ${Array.from({ length: 50 }).map((_, i) => {
              const t = (i / 49) * totalTime;
              const px = vx * t * scale;
              const py = (h0 + vy0 * t - 0.5 * g * t * t) * scale;
              return `L ${100 + px} ${600 - py}`;
            }).join(' ')}`}
            fill="none"
            stroke="rgba(251, 191, 36, 0.1)"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
        </svg>

        {/* Projectile */}
        <motion.div
          style={{ 
            left: 100 + visualX, 
            bottom: 80 + visualY 
          }}
          className="absolute w-6 h-6 bg-gold rounded-full shadow-[0_0_20px_rgba(251,191,36,0.5)] flex items-center justify-center"
        >
          <div className="w-1 h-1 bg-black rounded-full" />
        </motion.div>

        {/* Launch Platform */}
        <div 
          className="absolute bottom-20 left-[90px] w-5 bg-slate-800 border-x border-t border-slate-700"
          style={{ height: visualH0 }}
        />

        {/* Stats Overlay */}
        <div className="absolute top-8 right-8 flex flex-col gap-3">
          <div className="glass-panel px-6 py-4 rounded-2xl border-white/5 space-y-4">
            <div className="flex items-center gap-2 text-gold mb-2">
              <Target size={18} />
              <span className="text-xs font-black uppercase tracking-widest">Live Data</span>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Time</span>
              <span className="text-sm font-black text-white">{time.toFixed(2)} s</span>
              
              <span className="text-[10px] font-bold text-slate-500 uppercase">Velocity</span>
              <span className="text-sm font-black text-emerald-500">{curV.toFixed(1)} m/s</span>
              
              <span className="text-[10px] font-bold text-slate-500 uppercase">Height</span>
              <span className="text-sm font-black text-white">{curY.toFixed(1)} m</span>
              
              <span className="text-[10px] font-bold text-slate-500 uppercase">Distance</span>
              <span className="text-sm font-black text-white">{curX.toFixed(1)} m</span>
            </div>
          </div>

          <div className="glass-panel px-6 py-4 rounded-2xl border-white/5 space-y-4">
            <div className="flex items-center gap-2 text-gold mb-2">
              <Info size={18} />
              <span className="text-xs font-black uppercase tracking-widest">Key Results</span>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Max Height</span>
              <span className="text-sm font-black text-white">{maxHeight.toFixed(1)} m</span>
              
              <span className="text-[10px] font-bold text-slate-500 uppercase">Total Range</span>
              <span className="text-sm font-black text-gold">{range.toFixed(1)} m</span>
              
              <span className="text-[10px] font-bold text-slate-500 uppercase">Flight Time</span>
              <span className="text-sm font-black text-white">{totalTime.toFixed(2)} s</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="glass-panel rounded-3xl p-8 flex items-center justify-between border-white/5">
        <div className="flex gap-12">
          <div className="space-y-4">
            <div className="flex justify-between">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Initial Speed (m/s)</label>
              <span className="text-xs font-black text-white">{v0}</span>
            </div>
            <input 
              type="range" min="5" max="50" value={v0} 
              onChange={(e) => setV0(Number(e.target.value))}
              className="w-48 accent-gold"
            />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Launch Angle (°)</label>
              <span className="text-xs font-black text-white">{angle}</span>
            </div>
            <input 
              type="range" min="0" max="90" value={angle} 
              onChange={(e) => setAngle(Number(e.target.value))}
              className="w-48 accent-gold"
            />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Initial Height (m)</label>
              <span className="text-xs font-black text-white">{h0}</span>
            </div>
            <input 
              type="range" min="0" max="30" value={h0} 
              onChange={(e) => setH0(Number(e.target.value))}
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
