import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown, ArrowRight, Info, RotateCw } from 'lucide-react';
import { cn } from '../../../utils';

export default function BankedTrackSim() {
  const [mass, setMass] = useState(1000); // kg
  const [radius, setRadius] = useState(50); // m
  const [angle, setAngle] = useState(20); // degrees
  
  const g = 9.8;
  const angleRad = (angle * Math.PI) / 180;
  
  // Ideal speed: v = sqrt(rg tan(theta))
  const idealSpeed = Math.sqrt(radius * g * Math.tan(angleRad));
  
  // Forces
  const weight = mass * g;
  // Normal force N = mg / cos(theta)
  const normalForce = weight / Math.cos(angleRad);
  // Centripetal force Fc = N sin(theta) = mg tan(theta)
  const centripetalForce = weight * Math.tan(angleRad);

  return (
    <div className="w-full h-full flex flex-col p-8 gap-8 lg:flex-row overflow-y-auto custom-scrollbar">
      {/* Visual Area */}
      <div className="flex-1 flex flex-col gap-6">
        {/* 3D Perspective View */}
        <div className="h-1/2 glass-panel rounded-3xl relative overflow-hidden bg-slate-950/50 border-white/5 flex items-center justify-center">
          <div className="absolute top-6 left-6 flex items-center gap-2 text-gold">
            <RotateCw size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">3D Perspective View</span>
          </div>
          
          <div className="relative w-full h-full flex items-center justify-center perspective-[1000px]">
             {/* Track Ring */}
             <div 
               className="w-[400px] h-[150px] border-[20px] border-slate-800 rounded-[50%] transform rotateX(60deg)"
               style={{ 
                 borderColor: 'rgba(255,255,255,0.05)',
                 borderTopColor: 'rgba(251,191,36,0.2)',
                 borderWidth: `${20 + angle}px`
               }}
             />
             
             {/* Car */}
             <motion.div
               animate={{ 
                 rotate: 360 
               }}
               transition={{ 
                 duration: 10 / (idealSpeed / 10), 
                 repeat: Infinity, 
                 ease: "linear" 
               }}
               className="absolute w-[400px] h-[400px] flex items-center justify-center"
             >
                <div 
                  className="absolute left-0 w-12 h-8 bg-gold rounded-md shadow-[0_0_20px_rgba(251,191,36,0.4)]"
                  style={{ transform: `translateY(-60px) rotateX(-30deg) rotateZ(${-angle}deg)` }}
                />
             </motion.div>
          </div>
        </div>

        {/* 2D Cross Section */}
        <div className="h-1/2 glass-panel rounded-3xl relative overflow-hidden bg-slate-950/50 border-white/5 flex items-center justify-center">
          <div className="absolute top-6 left-6 flex items-center gap-2 text-gold">
            <Info size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">2D Cross Section & Forces</span>
          </div>

          <div className="relative w-80 h-60">
            {/* Slope */}
            <svg className="absolute inset-0 w-full h-full">
              <path 
                d={`M 50 200 L 300 200 L 300 ${200 - 250 * Math.tan(angleRad)} Z`} 
                fill="rgba(255,255,255,0.05)" 
                stroke="rgba(255,255,255,0.1)"
              />
              <text x="260" y="190" className="fill-slate-500 text-[10px] font-bold">θ = {angle}°</text>
            </svg>

            {/* Car Block */}
            <div 
              className="absolute w-16 h-10 bg-gold/20 border-2 border-gold/50 rounded-sm"
              style={{ 
                left: 150, 
                bottom: 60 + 100 * Math.tan(angleRad),
                transform: `rotate(${-angle}deg)`
              }}
            >
              {/* Force Vectors */}
              {/* Weight */}
              <div className="absolute top-1/2 left-1/2 w-0.5 bg-rose-500 origin-top" style={{ height: weight / 200, transform: `rotate(${angle}deg)` }}>
                <ArrowDown size={12} className="absolute bottom-0 -left-[5px] text-rose-500" />
                <div className="absolute top-full mt-1 -left-4 text-[8px] font-bold text-rose-500">mg</div>
              </div>

              {/* Normal Force */}
              <div className="absolute top-1/2 left-1/2 w-0.5 bg-emerald-500 origin-bottom -translate-y-full" style={{ height: normalForce / 200 }}>
                <ArrowUp size={12} className="absolute top-0 -left-[5px] text-emerald-500" />
                <div className="absolute bottom-full mb-1 -left-2 text-[8px] font-bold text-emerald-500">N</div>
              </div>

              {/* Centripetal Resultant (Horizontal) */}
              <div className="absolute top-1/2 left-1/2 h-0.5 bg-blue-500 origin-left -translate-x-full" style={{ width: centripetalForce / 200, transform: `rotate(${angle}deg)` }}>
                <div className="absolute right-full mr-1 -top-2 text-[8px] font-bold text-blue-500">F_c</div>
              </div>
            </div>
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
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Radius (m)</label>
                <span className="text-xs font-black text-white">{radius}</span>
              </div>
              <input 
                type="range" min="10" max="200" value={radius} 
                onChange={(e) => setRadius(Number(e.target.value))}
                className="w-full accent-gold"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Bank Angle (°)</label>
                <span className="text-xs font-black text-white">{angle}</span>
              </div>
              <input 
                type="range" min="0" max="45" value={angle} 
                onChange={(e) => setAngle(Number(e.target.value))}
                className="w-full accent-gold"
              />
            </div>

            <div className="p-4 rounded-2xl bg-gold/5 border border-gold/10">
              <div className="text-[10px] font-black text-gold uppercase tracking-widest mb-1">Ideal Speed</div>
              <div className="text-2xl font-black text-white">{(idealSpeed * 3.6).toFixed(1)} <span className="text-xs text-slate-500">km/h</span></div>
              <p className="text-[9px] text-slate-500 mt-2 italic">Speed where no friction is required.</p>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-8 border-white/5 flex-1 space-y-6">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Force Analysis</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Weight (mg)</span>
              <span className="text-sm font-black text-rose-500">{weight.toFixed(0)} N</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Normal (N)</span>
              <span className="text-sm font-black text-emerald-500">{normalForce.toFixed(0)} N</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-gold/10 border border-gold/20">
              <span className="text-[10px] font-bold text-gold uppercase">Centripetal (F_c)</span>
              <span className="text-sm font-black text-gold">{centripetalForce.toFixed(0)} N</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
            <div className="text-[10px] font-black text-slate-500 uppercase">Equation</div>
            <div className="text-xs font-mono text-white">F_c = N sin(θ) = mg tan(θ)</div>
            <div className="text-xs font-mono text-white">N = mg / cos(θ)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
