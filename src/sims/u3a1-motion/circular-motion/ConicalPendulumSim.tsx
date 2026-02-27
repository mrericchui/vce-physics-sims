import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown, ArrowRight, Info, RotateCw } from 'lucide-react';
import { cn } from '../../../utils';

export default function ConicalPendulumSim() {
  const [length, setLength] = useState(2); // m
  const [mass, setMass] = useState(0.5); // kg
  const [angle, setAngle] = useState(30); // degrees
  
  const g = 9.8;
  const angleRad = (angle * Math.PI) / 180;
  
  // Physics calculations
  const radius = length * Math.sin(angleRad);
  const height = length * Math.cos(angleRad);
  const tension = (mass * g) / Math.cos(angleRad);
  const centripetalForce = mass * g * Math.tan(angleRad);
  const velocity = Math.sqrt(radius * g * Math.tan(angleRad));
  const period = 2 * Math.PI * Math.sqrt(height / g);

  const [rotation, setRotation] = useState(0);
  const requestRef = useRef<number>(null);
  const lastTimeRef = useRef<number>(null);

  const animate = (time: number) => {
    if (lastTimeRef.current !== undefined) {
      const deltaTime = (time - lastTimeRef.current) / 1000;
      const omega = (2 * Math.PI) / period;
      setRotation(prev => (prev + omega * deltaTime) % (2 * Math.PI));
    }
    lastTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [period]);

  return (
    <div className="w-full h-full flex flex-col p-8 gap-8 lg:flex-row overflow-y-auto custom-scrollbar">
      {/* Visual Area */}
      <div className="flex-1 flex flex-col gap-6">
        {/* 3D Perspective View */}
        <div className="h-1/2 glass-panel rounded-3xl relative overflow-hidden bg-slate-950/50 border-white/5 flex items-center justify-center">
          <div className="absolute top-6 left-6 flex items-center gap-2 text-gold">
            <RotateCw size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">3D Swinging Motion</span>
          </div>
          
          <div className="relative w-full h-full flex items-center justify-center perspective-[1000px]">
             {/* Ceiling */}
             <div className="absolute top-20 w-20 h-1 bg-white/20" />
             
             {/* String & Ball Container */}
             <div 
               className="absolute top-20 flex flex-col items-center origin-top"
               style={{ 
                 transform: `rotateX(60deg) rotateZ(${rotation}rad)` 
               }}
             >
                <div 
                  className="w-0.5 bg-white/20 origin-top"
                  style={{ 
                    height: length * 100,
                    transform: `rotateY(${angle}deg)`
                  }}
                >
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-6 bg-gold rounded-full shadow-[0_0_20px_rgba(251,191,36,0.5)]" />
                </div>
             </div>

             {/* Circular Path Trace */}
             <div 
               className="absolute w-[200px] h-[200px] border border-dashed border-white/5 rounded-full transform rotateX(60deg)"
               style={{ 
                 width: radius * 200, 
                 height: radius * 200,
                 top: 20 + height * 100 - (radius * 100)
               }}
             />
          </div>
        </div>

        {/* 2D Force Diagram */}
        <div className="h-1/2 glass-panel rounded-3xl relative overflow-hidden bg-slate-950/50 border-white/5 flex items-center justify-center">
          <div className="absolute top-6 left-6 flex items-center gap-2 text-gold">
            <Info size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">2D Force Diagram</span>
          </div>

          <div className="relative w-80 h-80 flex flex-col items-center">
            {/* Ceiling */}
            <div className="w-20 h-1 bg-white/20 mt-10" />
            
            {/* Vertical Reference */}
            <div className="absolute top-10 left-1/2 w-px h-60 border-l border-dashed border-white/10" />

            {/* String */}
            <div 
              className="absolute top-10 left-1/2 w-0.5 bg-white/40 origin-top"
              style={{ height: 200, transform: `rotate(${angle}deg)` }}
            >
              {/* Ball */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-8 bg-gold/20 border-2 border-gold/50 rounded-full flex items-center justify-center">
                <span className="text-[8px] font-black text-gold">m</span>
                
                {/* Forces */}
                {/* Tension */}
                <div className="absolute bottom-1/2 left-1/2 w-0.5 bg-emerald-500 origin-bottom -translate-y-full" style={{ height: tension * 10 }}>
                  <ArrowUp size={12} className="absolute top-0 -left-[5px] text-emerald-500" />
                  <div className="absolute bottom-full mb-1 -left-2 text-[8px] font-bold text-emerald-500">T</div>
                </div>

                {/* Weight */}
                <div className="absolute top-1/2 left-1/2 w-0.5 bg-rose-500 origin-top" style={{ height: mass * g * 10, transform: `rotate(${-angle}deg)` }}>
                  <ArrowDown size={12} className="absolute bottom-0 -left-[5px] text-rose-500" />
                  <div className="absolute top-full mt-1 -left-4 text-[8px] font-bold text-rose-500">mg</div>
                </div>

                {/* Centripetal Resultant */}
                <div className="absolute top-1/2 left-1/2 h-0.5 bg-blue-500 origin-left -translate-x-full" style={{ width: centripetalForce * 10, transform: `rotate(${-angle}deg)` }}>
                  <div className="absolute right-full mr-1 -top-2 text-[8px] font-bold text-blue-500">F_c</div>
                </div>
              </div>
            </div>
            
            <div className="absolute top-16 left-[52%] text-[10px] font-bold text-slate-500">θ = {angle}°</div>
          </div>
        </div>
      </div>

      {/* Controls & Data */}
      <div className="w-full lg:w-96 flex flex-col gap-6">
        <div className="glass-panel rounded-3xl p-8 border-white/5 space-y-8">
          <h3 className="text-xl font-black text-gold uppercase tracking-tighter">Parameters</h3>
          
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">String Length (m)</label>
                <span className="text-xs font-black text-white">{length}</span>
              </div>
              <input 
                type="range" min="0.5" max="5" step="0.1" value={length} 
                onChange={(e) => setLength(Number(e.target.value))}
                className="w-full accent-gold"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Angle (°)</label>
                <span className="text-xs font-black text-white">{angle}</span>
              </div>
              <input 
                type="range" min="5" max="80" value={angle} 
                onChange={(e) => setAngle(Number(e.target.value))}
                className="w-full accent-gold"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Period</div>
                <div className="text-xl font-black text-white">{period.toFixed(2)}s</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Velocity</div>
                <div className="text-xl font-black text-white">{velocity.toFixed(1)}m/s</div>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-8 border-white/5 flex-1 space-y-6">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Equations</h3>
          
          <div className="space-y-4 font-mono text-xs">
            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <div className="text-slate-500 mb-1">Vertical Equilibrium</div>
              <div className="text-white">T cos(θ) = mg</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <div className="text-slate-500 mb-1">Horizontal Resultant</div>
              <div className="text-white">T sin(θ) = mv²/r</div>
            </div>
            <div className="p-3 rounded-xl bg-gold/10 border border-gold/20">
              <div className="text-gold/50 mb-1">Combined Result</div>
              <div className="text-gold font-bold">tan(θ) = v² / (rg)</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold uppercase">
              <span className="text-slate-500">Tension (T)</span>
              <span className="text-emerald-500">{tension.toFixed(1)} N</span>
            </div>
            <div className="flex justify-between text-[10px] font-bold uppercase">
              <span className="text-slate-500">Centripetal (F_c)</span>
              <span className="text-blue-500">{centripetalForce.toFixed(1)} N</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
