import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUp, ArrowDown, Info } from 'lucide-react';
import { cn } from '../../../utils';

export default function ElevatorForcesSim() {
  const [mass, setMass] = useState(70); // kg
  const [accelMag, setAccelMag] = useState(2); // m/s^2
  const [accelDir, setAccelDir] = useState<'up' | 'down'>('up');
  
  const g = 9.8;
  const weight = mass * g;
  
  // Fnet = ma
  // If up: N - mg = ma => N = m(g + a)
  // If down: mg - N = ma => N = m(g - a)
  const normalForce = accelDir === 'up' ? mass * (g + accelMag) : mass * (g - accelMag);
  const netForce = mass * accelMag;

  return (
    <div className="w-full h-full flex flex-col p-8 gap-8 lg:flex-row">
      {/* Simulation Visual */}
      <div className="flex-1 glass-panel rounded-3xl relative overflow-hidden bg-slate-950/50 border-white/5 flex items-center justify-center">
        <div className="relative w-64 h-96 border-x-2 border-white/5 flex flex-col items-center">
          {/* Elevator Box */}
          <motion.div 
            animate={{ y: accelDir === 'up' ? -20 : 20 }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-48 h-64 bg-midnight-light border-2 border-white/10 rounded-xl flex flex-col items-center justify-end p-4"
          >
            {/* Person */}
            <div className="w-12 h-24 bg-gold/20 border-2 border-gold/50 rounded-full mb-2 relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full w-8 h-8 rounded-full bg-gold/20 border-2 border-gold/50" />
            </div>
            
            {/* Scale */}
            <div className="w-32 h-4 bg-slate-800 border border-slate-700 rounded flex items-center justify-center">
              <span className="text-[10px] font-black text-gold">{normalForce.toFixed(0)} N</span>
            </div>
          </motion.div>

          {/* Force Vectors */}
          <div className="absolute left-full ml-8 top-1/2 -translate-y-1/2 space-y-8">
            {/* Normal Force Vector */}
            <div className="flex flex-col items-center">
              <div className="text-[10px] font-black text-emerald-500 uppercase mb-1">Normal (N)</div>
              <div className="w-1 bg-emerald-500" style={{ height: normalForce / 5 }} />
              <ArrowUp size={16} className="text-emerald-500 -mt-2" />
              <div className="text-xs font-black text-emerald-500 mt-1">{normalForce.toFixed(1)} N</div>
            </div>

            {/* Weight Vector */}
            <div className="flex flex-col items-center">
              <ArrowDown size={16} className="text-rose-500 -mb-2" />
              <div className="w-1 bg-rose-500" style={{ height: weight / 5 }} />
              <div className="text-[10px] font-black text-rose-500 uppercase mt-1">Weight (mg)</div>
              <div className="text-xs font-black text-rose-500 mt-1">{weight.toFixed(1)} N</div>
            </div>
          </div>
        </div>

        {/* Acceleration Indicator */}
        <div className="absolute top-8 left-8 flex items-center gap-4 glass-panel px-6 py-4 rounded-2xl border-white/5">
          <div className={cn(
            "p-3 rounded-xl",
            accelDir === 'up' ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
          )}>
            {accelDir === 'up' ? <ArrowUp size={24} /> : <ArrowDown size={24} />}
          </div>
          <div>
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Acceleration</div>
            <div className="text-xl font-black text-white">{accelMag} m/s²</div>
          </div>
        </div>
      </div>

      {/* Analysis & Controls */}
      <div className="w-full lg:w-96 flex flex-col gap-6">
        <div className="glass-panel rounded-3xl p-8 border-white/5 space-y-8">
          <h3 className="text-xl font-black text-gold uppercase tracking-tighter">Parameters</h3>
          
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Mass (kg)</label>
                <span className="text-xs font-black text-white">{mass}</span>
              </div>
              <input 
                type="range" min="10" max="150" value={mass} 
                onChange={(e) => setMass(Number(e.target.value))}
                className="w-full accent-gold"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Accel Mag (m/s²)</label>
                <span className="text-xs font-black text-white">{accelMag}</span>
              </div>
              <input 
                type="range" min="0" max="9.8" step="0.1" value={accelMag} 
                onChange={(e) => setAccelMag(Number(e.target.value))}
                className="w-full accent-gold"
              />
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => setAccelDir('up')}
                className={cn(
                  "flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all",
                  accelDir === 'up' ? "bg-gold text-black" : "bg-white/5 text-slate-500 hover:bg-white/10"
                )}
              >
                Accelerate Up
              </button>
              <button 
                onClick={() => setAccelDir('down')}
                className={cn(
                  "flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all",
                  accelDir === 'down' ? "bg-gold text-black" : "bg-white/5 text-slate-500 hover:bg-white/10"
                )}
              >
                Accelerate Down
              </button>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-8 border-white/5 flex-1">
          <div className="flex items-center gap-2 text-gold mb-6">
            <Info size={18} />
            <h3 className="text-sm font-black uppercase tracking-widest">Equation Derivation</h3>
          </div>
          
          <div className="space-y-4 font-mono text-xs">
            <div className="p-3 rounded-lg bg-white/5 border border-white/5">
              <div className="text-slate-500 mb-1">1. Define Net Force</div>
              <div className="text-white font-bold">F_net = m × a</div>
            </div>

            <div className="p-3 rounded-lg bg-white/5 border border-white/5">
              <div className="text-slate-500 mb-1">2. Identify Forces (up is positive)</div>
              <div className="text-white font-bold">
                {accelDir === 'up' 
                  ? "F_net = N - mg" 
                  : "F_net = N - mg"}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-gold/10 border border-gold/20">
              <div className="text-gold/50 mb-1">3. Solve for Normal Force (N)</div>
              <div className="text-gold font-bold">
                {accelDir === 'up' 
                  ? "N - mg = ma  =>  N = m(g + a)" 
                  : "N - mg = m(-a) =>  N = m(g - a)"}
              </div>
              <div className="mt-2 text-[10px] text-gold/70 italic">
                {accelDir === 'up' 
                  ? "N > Weight: You feel HEAVIER" 
                  : "N < Weight: You feel LIGHTER"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
