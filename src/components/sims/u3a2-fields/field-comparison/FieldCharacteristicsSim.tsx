import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Info, Zap, ArrowRight, Layers, Activity, Maximize2 } from 'lucide-react';
import { cn } from '../../../utils';

type FieldCharacteristic = 'static-changing' | 'uniform-nonuniform';

export default function FieldCharacteristicsSim() {
  const [mode, setMode] = useState<FieldCharacteristic>('static-changing');

  return (
    <div className="w-full h-full flex flex-col p-8 gap-8 lg:flex-row overflow-y-auto custom-scrollbar">
      {/* Visual Area */}
      <div className="flex-1 flex flex-col gap-8">
        <div className="flex-1 grid grid-cols-2 gap-8">
          {/* Left Panel */}
          <div className="glass-panel rounded-[2rem] relative overflow-hidden bg-slate-950/50 border-white/5 flex flex-col p-8">
            <div className="flex items-center gap-2 text-gold mb-8">
              <Layers size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">
                {mode === 'static-changing' ? 'Static Field' : 'Uniform Field'}
              </span>
            </div>
            
            <div className="flex-1 flex items-center justify-center relative">
              {mode === 'static-changing' ? (
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-blue-500/20 border-2 border-blue-400 flex items-center justify-center font-black text-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.3)]">Q</div>
                  <div className="absolute inset-0 w-48 h-48 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 border border-blue-400/20 rounded-full" />
                  <div className="absolute inset-0 w-64 h-64 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 border border-blue-400/10 rounded-full" />
                </div>
              ) : (
                <div className="flex flex-col gap-12 w-full px-12">
                  <div className="h-4 bg-rose-500/40 rounded-full border border-rose-400/50 flex items-center justify-center text-[8px] font-black text-white">POSITIVE PLATE</div>
                  <div className="flex justify-around">
                    {[1, 2, 3, 4, 5].map(i => (
                      <ArrowRight key={i} className="rotate-90 text-gold/40" size={24} />
                    ))}
                  </div>
                  <div className="h-4 bg-blue-500/40 rounded-full border border-blue-400/50 flex items-center justify-center text-[8px] font-black text-white">NEGATIVE PLATE</div>
                </div>
              )}
            </div>
            
            <p className="text-[10px] text-slate-500 text-center mt-4 uppercase tracking-widest font-bold">
              {mode === 'static-changing' ? 'Constant in time' : 'Constant in space'}
            </p>
          </div>

          {/* Right Panel */}
          <div className="glass-panel rounded-[2rem] relative overflow-hidden bg-slate-950/50 border-white/5 flex flex-col p-8">
            <div className="flex items-center gap-2 text-gold mb-8">
              <Activity size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">
                {mode === 'static-changing' ? 'Changing Field' : 'Non-Uniform Field'}
              </span>
            </div>

            <div className="flex-1 flex items-center justify-center relative">
              {mode === 'static-changing' ? (
                <div className="relative">
                  <motion.div 
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 w-32 h-32 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 border-2 border-gold rounded-full"
                  />
                  <div className="w-16 h-16 rounded-full bg-gold/20 border-2 border-gold flex items-center justify-center font-black text-gold shadow-[0_0_30px_rgba(251,191,36,0.3)]">
                    <Activity size={24} />
                  </div>
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 w-48 h-48 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 border border-dashed border-gold/40 rounded-full"
                  />
                </div>
              ) : (
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center font-black text-white shadow-xl">M</div>
                  {/* Radial Field Lines */}
                  {Array.from({ length: 8 }).map((_, i) => {
                    const angle = (i / 8) * 2 * Math.PI;
                    return (
                      <div 
                        key={i}
                        className="absolute w-32 h-px bg-gradient-to-r from-white/40 to-transparent"
                        style={{ transform: `rotate(${angle}rad) translateX(24px)`, transformOrigin: 'left' }}
                      />
                    );
                  })}
                </div>
              )}
            </div>

            <p className="text-[10px] text-slate-500 text-center mt-4 uppercase tracking-widest font-bold">
              {mode === 'static-changing' ? 'Varies with time' : 'Varies with distance'}
            </p>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="glass-panel rounded-3xl p-8 border-white/5">
          <div className="grid grid-cols-3 gap-8">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-gold uppercase tracking-widest">Characteristic</h4>
              <div className="text-xs font-bold text-white">Definition</div>
              <div className="text-xs font-bold text-white">Example</div>
              <div className="text-xs font-bold text-white">Key Equation</div>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                {mode === 'static-changing' ? 'Static' : 'Uniform'}
              </h4>
              <div className="text-[10px] text-slate-400">
                {mode === 'static-changing' ? 'Field properties do not change over time.' : 'Field strength and direction are constant throughout the region.'}
              </div>
              <div className="text-[10px] text-slate-400">
                {mode === 'static-changing' ? 'Field around a stationary point charge.' : 'Field between two large parallel charged plates.'}
              </div>
              <div className="text-[10px] font-mono text-gold">
                {mode === 'static-changing' ? 'dB/dt = 0' : 'E = V/d'}
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                {mode === 'static-changing' ? 'Changing' : 'Non-Uniform'}
              </h4>
              <div className="text-[10px] text-slate-400">
                {mode === 'static-changing' ? 'Field properties vary with time (e.g. electromagnetic induction).' : 'Field strength and/or direction vary depending on position.'}
              </div>
              <div className="text-[10px] text-slate-400">
                {mode === 'static-changing' ? 'Field inside a generator or transformer.' : 'Gravitational field around a planet.'}
              </div>
              <div className="text-[10px] font-mono text-gold">
                {mode === 'static-changing' ? 'ε = -N(dΦ/dt)' : 'g = GM/r²'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="w-full lg:w-[350px] flex flex-col gap-6">
        <div className="glass-panel rounded-3xl p-8 border-white/5 space-y-6">
          <h3 className="text-sm font-black text-gold uppercase tracking-widest">Comparison Mode</h3>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setMode('static-changing')}
              className={cn(
                "p-4 rounded-2xl border transition-all flex items-center gap-4 text-left",
                mode === 'static-changing' ? "bg-gold/10 border-gold text-gold" : "bg-white/5 border-white/5 text-slate-500 hover:bg-white/10"
              )}
            >
              <Activity size={20} />
              <span className="text-[10px] font-black uppercase tracking-widest">Static vs Changing</span>
            </button>
            <button
              onClick={() => setMode('uniform-nonuniform')}
              className={cn(
                "p-4 rounded-2xl border transition-all flex items-center gap-4 text-left",
                mode === 'uniform-nonuniform' ? "bg-gold/10 border-gold text-gold" : "bg-white/5 border-white/5 text-slate-500 hover:bg-white/10"
              )}
            >
              <Maximize2 size={20} />
              <span className="text-[10px] font-black uppercase tracking-widest">Uniform vs Non-Uniform</span>
            </button>
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-8 border-white/5 flex-1 space-y-6">
          <div className="flex items-center gap-2 text-gold">
            <Info size={18} />
            <h3 className="text-sm font-black uppercase tracking-widest">Physics Note</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            In VCE Physics, we often assume fields are <span className="text-white font-bold">static</span> for initial calculations. 
            However, <span className="text-white font-bold">changing</span> magnetic fields are the basis for electricity generation (Faraday's Law).
          </p>
          <p className="text-xs text-slate-400 leading-relaxed">
            <span className="text-white font-bold">Uniform</span> fields are ideal models (like between plates), while most natural fields (like gravity) are <span className="text-white font-bold">non-uniform</span> and follow the inverse square law.
          </p>
        </div>
      </div>
    </div>
  );
}
