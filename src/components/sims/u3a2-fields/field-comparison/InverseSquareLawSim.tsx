import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Info, Zap, Globe, Grid3X3, ArrowRight, Lightbulb } from 'lucide-react';
import { cn } from '../../../utils';

export default function InverseSquareLawSim() {
  const [distance, setDistance] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [mode, setMode] = useState<'gravity' | 'electric' | 'light'>('gravity');

  const intensity = 1 / (distance * distance);

  return (
    <div className="w-full h-full flex flex-col p-8 gap-8 lg:flex-row overflow-y-auto custom-scrollbar">
      {/* Visual Area */}
      <div className="flex-1 glass-panel rounded-3xl relative overflow-hidden bg-slate-950/50 border-white/5 flex flex-col">
        <div className="absolute top-8 left-8 flex items-center gap-2 text-gold z-20">
          <Grid3X3 size={18} />
          <span className="text-[10px] font-black uppercase tracking-widest">Inverse Square Law Visualiser</span>
        </div>

        <div className="flex-1 flex items-center justify-center relative">
          {/* Source */}
          <div className="absolute left-20 z-10">
            <div className="relative">
              {mode === 'gravity' && <Globe className="text-blue-400" size={48} />}
              {mode === 'electric' && <Zap className="text-rose-400" size={48} />}
              {mode === 'light' && <Lightbulb className="text-gold" size={48} />}
              <div className="absolute inset-0 bg-current opacity-20 blur-2xl rounded-full animate-pulse" />
            </div>
          </div>

          {/* Spreading Grid */}
          <div className="relative flex items-center h-full w-full pl-40">
            {/* Perspective Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
              <line x1="100" y1="50%" x2="100%" y2="0" stroke="white" strokeWidth="1" />
              <line x1="100" y1="50%" x2="100%" y2="100%" stroke="white" strokeWidth="1" />
            </svg>

            {/* The Grid at Distance r */}
            <motion.div 
              animate={{ 
                x: distance * 100,
                scale: distance,
                opacity: 1 / distance
              }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
              className="relative z-10"
            >
              <div className="w-32 h-32 border-2 border-gold/50 bg-gold/5 grid grid-cols-2 grid-rows-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="border border-gold/20 flex items-center justify-center">
                    {showGrid && <div className="w-1 h-1 bg-gold/40 rounded-full" />}
                  </div>
                ))}
              </div>
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-black text-gold uppercase tracking-widest whitespace-nowrap">
                Area ∝ r²
              </div>
            </motion.div>

            {/* Distance Marker */}
            <div className="absolute bottom-20 left-40 right-40 h-px bg-white/10 flex items-center justify-center">
              <div className="absolute left-0 w-2 h-2 bg-white/20 rounded-full" />
              <motion.div 
                animate={{ x: distance * 100 }}
                className="absolute left-0 w-4 h-4 bg-gold rounded-full border-2 border-black flex items-center justify-center"
              >
                <div className="text-[8px] font-black text-black">r</div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Intensity Meter */}
        <div className="h-24 border-t border-white/5 bg-black/20 p-6 flex items-center justify-between">
          <div className="flex gap-8">
            <div className="space-y-1">
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Distance (r)</div>
              <div className="text-xl font-black text-white">{distance.toFixed(1)} <span className="text-xs text-slate-500">units</span></div>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Intensity (1/r²)</div>
              <div className="text-xl font-black text-gold">{(intensity * 100).toFixed(1)}%</div>
            </div>
          </div>
          <div className="flex-1 max-w-md mx-12 h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              animate={{ width: `${intensity * 100}%` }}
              className="h-full bg-gold shadow-[0_0_15px_rgba(251,191,36,0.5)]" 
            />
          </div>
        </div>
      </div>

      {/* Controls & Equations */}
      <div className="w-full lg:w-[400px] flex flex-col gap-6">
        <div className="glass-panel rounded-3xl p-8 border-white/5 space-y-6">
          <h3 className="text-sm font-black text-gold uppercase tracking-widest">Simulation Controls</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Distance (r)</label>
              <span className="text-xs font-black text-white">{distance}x</span>
            </div>
            <input 
              type="range" min="1" max="4" step="0.1" value={distance} 
              onChange={(e) => setDistance(Number(e.target.value))}
              className="w-full accent-gold"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            {(['gravity', 'electric', 'light'] as const).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={cn(
                  "p-3 rounded-xl border transition-all flex flex-col items-center gap-2",
                  mode === m ? "bg-gold/10 border-gold text-gold" : "bg-white/5 border-white/5 text-slate-500 hover:bg-white/10"
                )}
              >
                {m === 'gravity' && <Globe size={16} />}
                {m === 'electric' && <Zap size={16} />}
                {m === 'light' && <Lightbulb size={16} />}
                <span className="text-[8px] font-black uppercase">{m}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-8 border-white/5 flex-1 space-y-6">
          <div className="flex items-center gap-2 text-gold">
            <Info size={18} />
            <h3 className="text-sm font-black uppercase tracking-widest">Equation Comparison</h3>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
              <div className="text-[10px] font-black text-blue-400 uppercase">Gravitational Force</div>
              <div className="text-lg font-mono text-white">{"F_g = G * (m₁m₂ / r²)"}</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
              <div className="text-[10px] font-black text-rose-400 uppercase">Electric Force</div>
              <div className="text-lg font-mono text-white">{"F_e = k * (q₁q₂ / r²)"}</div>
            </div>
            <div className="p-4 rounded-2xl bg-gold/5 border border-gold/10 space-y-2">
              <div className="text-[10px] font-black text-gold uppercase">The Gateway Analogy</div>
              <p className="text-[10px] text-slate-400 leading-relaxed italic">
                Imagine light from a bulb. At distance $r$, the light passes through 1 grid square. 
                At distance $2r$, the same amount of light must spread over 4 squares ($2^2$). 
                Thus, the intensity is $1/4$ of the original.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
