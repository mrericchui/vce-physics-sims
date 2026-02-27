import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Info, Zap, ArrowRight, RotateCw, Eye } from 'lucide-react';
import { cn } from '../../../utils';

export default function SolenoidFieldSim() {
  const [currentDir, setCurrentDir] = useState<'forward' | 'reverse'>('forward');

  return (
    <div className="w-full h-full flex flex-col p-8 gap-8 lg:flex-row overflow-y-auto custom-scrollbar">
      {/* Visual Area */}
      <div className="flex-1 glass-panel rounded-3xl relative overflow-hidden bg-slate-950/50 border-white/5 flex items-center justify-center">
        <div className="absolute top-8 left-8 flex items-center gap-2 text-gold">
          <RotateCw size={18} />
          <span className="text-[10px] font-black uppercase tracking-widest">Solenoid Magnetic Field</span>
        </div>

        <div className="relative w-[500px] h-[300px] flex items-center justify-center">
          {/* Internal Field Lines */}
          <div className="absolute inset-0 flex flex-col justify-center gap-4 opacity-30">
            {[1, 2, 3, 4, 5].map(i => (
              <motion.div
                key={i}
                animate={{ x: currentDir === 'forward' ? [0, 500] : [500, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-full h-px bg-gold"
              />
            ))}
          </div>

          {/* Solenoid Coils */}
          <div className="relative z-10 flex gap-2">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="relative w-6 h-40">
                {/* Back of coil */}
                <div className="absolute inset-0 bg-slate-700/50 rounded-full border-l-2 border-white/5" />
                {/* Front of coil */}
                <motion.div 
                  animate={{ 
                    y: currentDir === 'forward' ? [0, 10, 0] : [0, -10, 0],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                  className="absolute inset-0 bg-gold/20 rounded-full border-r-4 border-gold shadow-[5px_0_15px_rgba(251,191,36,0.2)]" 
                />
                {/* Current Direction Indicator */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] font-black text-gold">
                  {currentDir === 'forward' ? '⊗' : '⊙'}
                </div>
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] font-black text-gold">
                  {currentDir === 'forward' ? '⊙' : '⊗'}
                </div>
              </div>
            ))}
          </div>

          {/* North/South Labels */}
          <motion.div 
            animate={{ x: currentDir === 'forward' ? 280 : -280 }}
            className="absolute px-6 py-3 bg-rose-600 text-white font-black rounded-xl shadow-2xl z-20 border-2 border-white/20"
          >
            NORTH
          </motion.div>
          <motion.div 
            animate={{ x: currentDir === 'forward' ? -280 : 280 }}
            className="absolute px-6 py-3 bg-slate-700 text-white font-black rounded-xl shadow-2xl z-20 border-2 border-white/20"
          >
            SOUTH
          </motion.div>

          {/* External Field Lines (Simplified) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
            <ellipse cx="250" cy="50" rx="300" ry="80" fill="none" stroke="gold" strokeWidth="1" strokeDasharray="5 5" />
            <ellipse cx="250" cy="250" rx="300" ry="80" fill="none" stroke="gold" strokeWidth="1" strokeDasharray="5 5" />
          </svg>
        </div>
      </div>

      {/* Controls & Theory */}
      <div className="w-full lg:w-[400px] flex flex-col gap-6">
        <div className="glass-panel rounded-3xl p-8 border-white/5 space-y-8">
          <h3 className="text-sm font-black text-gold uppercase tracking-widest">Controls</h3>
          
          <div className="space-y-6">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Current Direction</label>
              <div className="flex gap-2">
                <button 
                  onClick={() => setCurrentDir('forward')}
                  className={cn(
                    "flex-1 py-3 rounded-xl border transition-all font-black text-[10px] uppercase tracking-widest",
                    currentDir === 'forward' ? "bg-gold text-black border-gold" : "bg-white/5 border-white/5 text-slate-500"
                  )}
                >
                  Clockwise
                </button>
                <button 
                  onClick={() => setCurrentDir('reverse')}
                  className={cn(
                    "flex-1 py-3 rounded-xl border transition-all font-black text-[10px] uppercase tracking-widest",
                    currentDir === 'reverse' ? "bg-gold text-black border-gold" : "bg-white/5 border-white/5 text-slate-500"
                  )}
                >
                  Anti-clockwise
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-8 border-white/5 flex-1 space-y-6">
          <div className="flex items-center gap-2 text-gold">
            <Info size={18} />
            <h3 className="text-sm font-black uppercase tracking-widest">Right Hand Grip Rule (Solenoid)</h3>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
              <p className="text-[10px] text-slate-400 leading-relaxed">
                1. Curl your <span className="text-gold font-bold">fingers</span> in the direction of the current through the coils.
              </p>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                2. Your <span className="text-gold font-bold">thumb</span> points towards the <span className="text-rose-500 font-bold">North Pole</span> of the solenoid.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-gold/5 border border-gold/10 space-y-2">
              <div className="text-[10px] font-black text-gold uppercase tracking-widest">Key Insights</div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Inside the solenoid, the magnetic field is <span className="text-white font-bold">strong and uniform</span>. 
                Outside, the field pattern resembles that of a <span className="text-white font-bold">bar magnet</span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
