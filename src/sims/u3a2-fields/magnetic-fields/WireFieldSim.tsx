import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Info, Zap, ArrowUp, ArrowDown, RotateCw, Eye } from 'lucide-react';
import { cn } from '../../../utils';

export default function WireFieldSim() {
  const [currentDirection, setCurrentDirection] = useState<'up' | 'down'>('up');
  const [viewMode, setViewMode] = useState<'perspective' | 'cross-section'>('perspective');

  return (
    <div className="w-full h-full flex flex-col p-8 gap-8 lg:flex-row overflow-y-auto custom-scrollbar">
      {/* Visual Area */}
      <div className="flex-1 glass-panel rounded-3xl relative overflow-hidden bg-slate-950/50 border-white/5 flex items-center justify-center">
        <div className="absolute top-8 left-8 flex items-center gap-2 text-gold">
          <Eye size={18} />
          <span className="text-[10px] font-black uppercase tracking-widest">{viewMode === 'perspective' ? 'Perspective View' : 'Cross-section View'}</span>
        </div>

        {viewMode === 'perspective' ? (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Wire */}
            <div className="absolute w-4 h-[80%] bg-slate-700 rounded-full border border-white/10 shadow-2xl flex items-center justify-center">
              <div className="w-1 h-full bg-gold/30" />
              {/* Current Arrow */}
              <motion.div 
                animate={{ y: currentDirection === 'up' ? -20 : 20 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="absolute text-gold"
              >
                {currentDirection === 'up' ? <ArrowUp size={24} /> : <ArrowDown size={24} />}
              </motion.div>
            </div>

            {/* Field Lines (Concentric Circles) */}
            <div className="relative w-full h-full flex items-center justify-center perspective-[1000px]">
              {[1, 2, 3].map(i => (
                <motion.div
                  key={i}
                  animate={{ rotateZ: currentDirection === 'up' ? 360 : -360 }}
                  transition={{ duration: 4 / i, repeat: Infinity, ease: "linear" }}
                  className="absolute border-2 border-dashed border-gold/20 rounded-full flex items-center justify-center"
                  style={{ 
                    width: i * 100, 
                    height: i * 40,
                    transform: 'rotateX(70deg)'
                  }}
                >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-gold/40" />
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Wire Cross Section */}
            <div className="relative w-24 h-24 rounded-full bg-slate-800 border-4 border-slate-600 flex items-center justify-center shadow-[0_0_50px_rgba(251,191,36,0.1)]">
              {currentDirection === 'up' ? (
                <div className="w-4 h-4 bg-gold rounded-full shadow-[0_0_20px_rgba(251,191,36,0.8)]" /> // Dot
              ) : (
                <div className="relative w-12 h-12 flex items-center justify-center">
                  <div className="absolute w-full h-1 bg-gold rotate-45" />
                  <div className="absolute w-full h-1 bg-gold -rotate-45" />
                </div> // Cross
              )}
              <div className="absolute -bottom-8 text-[10px] font-black text-gold uppercase tracking-widest">
                {currentDirection === 'up' ? 'Current Out (⊙)' : 'Current In (⊗)'}
              </div>
            </div>

            {/* Field Vectors */}
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i / 12) * 2 * Math.PI;
                const r = 120;
                const x = 50 + (r / 5) * Math.cos(angle);
                const y = 50 + (r / 3) * Math.sin(angle);
                const arrowAngle = angle + (currentDirection === 'up' ? Math.PI/2 : -Math.PI/2);
                return (
                  <div 
                    key={i}
                    className="absolute w-4 h-0.5 bg-gold/40"
                    style={{ 
                      left: `${x}%`, 
                      top: `${y}%`,
                      transform: `rotate(${arrowAngle}rad)`
                    }}
                  >
                    <div className="absolute right-0 -top-1 w-0 h-0 border-l-[4px] border-l-gold/40 border-t-[2.5px] border-t-transparent border-b-[2.5px] border-b-transparent" />
                  </div>
                );
              })}
            </div>
          </div>
        )}
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
                  onClick={() => setCurrentDirection('up')}
                  className={cn(
                    "flex-1 py-3 rounded-xl border transition-all font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2",
                    currentDirection === 'up' ? "bg-gold text-black border-gold" : "bg-white/5 border-white/5 text-slate-500"
                  )}
                >
                  <ArrowUp size={14} /> Up / Out
                </button>
                <button 
                  onClick={() => setCurrentDirection('down')}
                  className={cn(
                    "flex-1 py-3 rounded-xl border transition-all font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2",
                    currentDirection === 'down' ? "bg-gold text-black border-gold" : "bg-white/5 border-white/5 text-slate-500"
                  )}
                >
                  <ArrowDown size={14} /> Down / In
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">View Mode</label>
              <div className="flex gap-2">
                <button 
                  onClick={() => setViewMode('perspective')}
                  className={cn(
                    "flex-1 py-3 rounded-xl border transition-all font-black text-[10px] uppercase tracking-widest",
                    viewMode === 'perspective' ? "bg-white/10 border-white/20 text-white" : "bg-white/5 border-white/5 text-slate-500"
                  )}
                >
                  Perspective
                </button>
                <button 
                  onClick={() => setViewMode('cross-section')}
                  className={cn(
                    "flex-1 py-3 rounded-xl border transition-all font-black text-[10px] uppercase tracking-widest",
                    viewMode === 'cross-section' ? "bg-white/10 border-white/20 text-white" : "bg-white/5 border-white/5 text-slate-500"
                  )}
                >
                  Cross-section
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-8 border-white/5 flex-1 space-y-6">
          <div className="flex items-center gap-2 text-gold">
            <Info size={18} />
            <h3 className="text-sm font-black uppercase tracking-widest">Right Hand Grip Rule</h3>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
              <p className="text-[10px] text-slate-400 leading-relaxed">
                1. Point your <span className="text-gold font-bold">thumb</span> in the direction of the conventional current.
              </p>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                2. Your <span className="text-gold font-bold">fingers</span> curl in the direction of the magnetic field lines.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-gold/5 border border-gold/10 space-y-3">
              <div className="text-[10px] font-black text-gold uppercase tracking-widest">Dot & Cross Convention</div>
              <div className="flex gap-4 items-center">
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-gold flex items-center justify-center text-gold font-black">⊙</div>
                <p className="text-[9px] text-slate-400 italic">
                  <span className="text-white font-bold">Dot:</span> Coming <span className="text-gold">OUT</span> of the page. Imagine an arrow head flying towards you.
                </p>
              </div>
              <div className="flex gap-4 items-center">
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-gold flex items-center justify-center text-gold font-black">⊗</div>
                <p className="text-[9px] text-slate-400 italic">
                  <span className="text-white font-bold">Cross:</span> Going <span className="text-gold">INTO</span> the page. Imagine the tail feathers of an arrow flying away.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
