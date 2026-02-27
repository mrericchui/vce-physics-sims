import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Info, Zap, ArrowRight, MousePointer2 } from 'lucide-react';
import { cn } from '../../../utils';

export default function ParallelPlateSim() {
  const [voltage, setVoltage] = useState(100); // V
  const [separation, setSeparation] = useState(0.1); // m (10cm)
  const [probePos, setProbePos] = useState({ x: 0.5, y: 0.5 });
  const containerRef = useRef<HTMLDivElement>(null);

  const fieldStrength = voltage / separation; // V/m

  // Calculate field at point (px, py) - includes fringing approximation
  const getFieldAt = (px: number, py: number) => {
    // Plates are at y = 0.3 and y = 0.7 (normalized)
    // x range is 0.2 to 0.8
    const plateTopY = 0.3;
    const plateBottomY = 0.7;
    const plateLeftX = 0.2;
    const plateRightX = 0.8;

    // Inside plates
    if (px >= plateLeftX && px <= plateRightX) {
      if (py >= plateTopY && py <= plateBottomY) {
        return fieldStrength;
      }
    }

    // Fringing effect approximation
    // Distance to nearest plate edge
    const dx = Math.min(Math.abs(px - plateLeftX), Math.abs(px - plateRightX));
    const dy = Math.min(Math.abs(py - plateTopY), Math.abs(py - plateBottomY));
    
    // Simple decay model for fringing
    const dist = Math.sqrt(dx * dx + dy * dy);
    const decay = Math.exp(-dist * 10);
    return fieldStrength * decay;
  };

  const currentProbeField = getFieldAt(probePos.x, probePos.y);

  return (
    <div className="w-full h-full flex flex-col p-8 gap-8 lg:flex-row">
      {/* Simulation Area */}
      <div className="flex-1 glass-panel rounded-3xl relative overflow-hidden bg-slate-950/50 border-white/5" ref={containerRef}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-[600px] h-[400px]">
            {/* Top Plate (+) */}
            <div className="absolute top-[120px] left-[120px] w-[360px] h-4 bg-rose-500/20 border-2 border-rose-500/50 rounded-full flex items-center justify-center">
              <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Positive Plate (+)</span>
            </div>

            {/* Bottom Plate (-) */}
            <div className="absolute bottom-[120px] left-[120px] w-[360px] h-4 bg-blue-500/20 border-2 border-blue-500/50 rounded-full flex items-center justify-center">
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Negative Plate (-)</span>
            </div>

            {/* Field Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {/* Uniform Field Lines */}
              {Array.from({ length: 15 }).map((_, i) => {
                const x = 140 + i * 23;
                return (
                  <g key={i}>
                    <line x1={x} y1={140} x2={x} y2={260} stroke="rgba(251, 191, 36, 0.3)" strokeWidth="1" strokeDasharray="4 4" />
                    <path d={`M ${x-3} 200 L ${x} 205 L ${x+3} 200`} fill="rgba(251, 191, 36, 0.5)" />
                  </g>
                );
              })}
              
              {/* Fringing Lines (Left) */}
              <path d="M 120 140 Q 80 200 120 260" fill="none" stroke="rgba(251, 191, 36, 0.15)" strokeWidth="1" strokeDasharray="4 4" />
              <path d="M 100 140 Q 40 200 100 260" fill="none" stroke="rgba(251, 191, 36, 0.1)" strokeWidth="1" strokeDasharray="4 4" />
              
              {/* Fringing Lines (Right) */}
              <path d="M 480 140 Q 520 200 480 260" fill="none" stroke="rgba(251, 191, 36, 0.15)" strokeWidth="1" strokeDasharray="4 4" />
              <path d="M 500 140 Q 560 200 500 260" fill="none" stroke="rgba(251, 191, 36, 0.1)" strokeWidth="1" strokeDasharray="4 4" />
            </svg>

            {/* Field Strength Meter (Probe) */}
            <motion.div
              drag
              dragMomentum={false}
              onDrag={(_, info) => {
                if (!containerRef.current) return;
                const rect = containerRef.current.getBoundingClientRect();
                const newX = (info.point.x - rect.left) / rect.width;
                const newY = (info.point.y - rect.top) / rect.height;
                setProbePos({ x: newX, y: newY });
              }}
              style={{ 
                left: `${probePos.x * 100}%`, 
                top: `${probePos.y * 100}%`,
                x: '-50%',
                y: '-50%'
              }}
              className="absolute w-12 h-12 bg-gold text-black rounded-xl flex items-center justify-center cursor-grab active:cursor-grabbing z-30 shadow-2xl border-2 border-white/20"
            >
              <MousePointer2 size={24} />
              <div className="absolute top-full mt-2 bg-black/80 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg whitespace-nowrap">
                <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Field Strength</div>
                <div className="text-xs font-black text-gold">{currentProbeField.toFixed(0)} V/m</div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Info Overlay */}
        <div className="absolute top-8 left-8 flex items-center gap-3 glass-panel px-6 py-4 rounded-2xl border-white/5">
          <div className="p-3 bg-gold/10 rounded-xl text-gold">
            <Zap size={20} />
          </div>
          <div>
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Theoretical Field</div>
            <div className="text-xl font-black text-white">{fieldStrength.toFixed(0)} V/m</div>
          </div>
        </div>
      </div>

      {/* Controls & Analysis */}
      <div className="w-full lg:w-96 flex flex-col gap-6">
        <div className="glass-panel rounded-3xl p-8 border-white/5 space-y-8">
          <h3 className="text-xl font-black text-gold uppercase tracking-tighter">Parameters</h3>
          
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Voltage (V)</label>
                <span className="text-xs font-black text-white">{voltage} V</span>
              </div>
              <input 
                type="range" min="10" max="500" value={voltage} 
                onChange={(e) => setVoltage(Number(e.target.value))}
                className="w-full accent-gold"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Separation (m)</label>
                <span className="text-xs font-black text-white">{separation.toFixed(2)} m</span>
              </div>
              <input 
                type="range" min="0.05" max="0.30" step="0.01" value={separation} 
                onChange={(e) => setSeparation(Number(e.target.value))}
                className="w-full accent-gold"
              />
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-8 border-white/5 flex-1 space-y-6">
          <div className="flex items-center gap-2 text-gold">
            <Info size={18} />
            <h3 className="text-sm font-black uppercase tracking-widest">VCE Physics Analysis</h3>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <div className="text-[10px] font-black text-slate-500 uppercase mb-2">Uniform Field Equation</div>
              <div className="text-lg font-mono text-white">E = V / d</div>
              <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">
                Between the plates, the field is <span className="text-gold font-bold">uniform</span>. This means the field strength and direction are constant at all points.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-gold/5 border border-gold/10">
              <div className="text-[10px] font-black text-gold uppercase mb-2">Fringing Effect</div>
              <p className="text-[10px] text-slate-400 leading-relaxed italic">
                Notice how the field strength drops as you move the probe outside the plates. This non-uniformity at the boundaries is known as the fringing effect.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
