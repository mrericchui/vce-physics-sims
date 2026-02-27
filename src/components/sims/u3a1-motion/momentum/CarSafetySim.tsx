import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Info, Zap, Activity, ShieldCheck, ShieldAlert, RotateCcw, Play } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts';
import { cn } from '../../../utils';

export default function CarSafetySim() {
  const [safetyEnabled, setSafetyEnabled] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  const mass = 1000; // kg
  const velocity = 20; // m/s (72 km/h)
  const momentumChange = mass * velocity; // kg m/s

  // Collision parameters
  const timeRigid = 0.05; // s
  const timeSafety = 0.25; // s

  const forceRigid = momentumChange / timeRigid; // N
  const forceSafety = momentumChange / timeSafety; // N

  const graphData = useMemo(() => {
    const data = [];
    const steps = 100;
    const maxT = 0.4;
    
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * maxT;
      
      // Rigid Force (Gaussian-like peak)
      const fRigid = Math.exp(-Math.pow(t - 0.05, 2) / (2 * Math.pow(0.015, 2))) * forceRigid;
      
      // Safety Force (Gaussian-like peak, wider and lower)
      const fSafety = Math.exp(-Math.pow(t - 0.15, 2) / (2 * Math.pow(0.06, 2))) * forceSafety;
      
      data.push({
        t: t.toFixed(3),
        rigid: Number(fRigid.toFixed(0)),
        safety: Number(fSafety.toFixed(0))
      });
    }
    return data;
  }, [forceRigid, forceSafety]);

  const reset = () => {
    setIsPlaying(false);
    setAnimKey(prev => prev + 1);
  };

  return (
    <div className="w-full h-full flex flex-col p-8 gap-8 lg:flex-row overflow-y-auto custom-scrollbar">
      {/* Visual Area */}
      <div className="flex-1 flex flex-col gap-8">
        <div className="flex-1 glass-panel rounded-3xl relative overflow-hidden bg-slate-950/50 border-white/5 flex items-center justify-center">
          <div className="absolute top-8 left-8 flex items-center gap-2 text-gold">
            <Activity size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">Impact Test</span>
          </div>

          {/* Wall */}
          <div className="absolute right-20 w-8 h-48 bg-slate-800 border-l-4 border-slate-600 rounded-r-xl" />

          {/* Car */}
          <motion.div
            key={animKey}
            initial={{ x: -300 }}
            animate={isPlaying ? { x: 180 } : { x: -300 }}
            transition={{ 
              duration: 1.5, 
              ease: "easeIn",
              onComplete: () => setIsPlaying(false)
            }}
            className="relative"
          >
            <div className={cn(
              "w-32 h-16 rounded-xl border-2 flex items-center justify-center transition-all duration-300",
              safetyEnabled ? "bg-emerald-500/20 border-emerald-400" : "bg-rose-500/20 border-rose-400"
            )}>
              <div className="text-[10px] font-black uppercase tracking-widest">
                {safetyEnabled ? 'Safe Car' : 'Rigid Car'}
              </div>
              {/* Crumple Zone Visual */}
              {safetyEnabled && (
                <motion.div 
                  animate={isPlaying ? { width: 10 } : { width: 30 }}
                  className="absolute right-0 top-0 bottom-0 bg-emerald-400/30 border-l border-emerald-400/50"
                />
              )}
            </div>
          </motion.div>

          {/* Impact Alert */}
          {isPlaying && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 1] }}
              transition={{ delay: 1.4 }}
              className="absolute right-32 text-gold font-black text-2xl"
            >
              IMPACT!
            </motion.div>
          )}
        </div>

        {/* Graph Area */}
        <div className="h-[350px] glass-panel rounded-3xl p-8 border-white/5 flex flex-col">
          <div className="flex items-center gap-2 text-gold mb-6">
            <Activity size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Impact Force vs Time</span>
          </div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={graphData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="t" stroke="#64748b" fontSize={10} label={{ value: 'Time (s)', position: 'insideBottom', offset: -5, fill: '#64748b', fontSize: 10 }} />
                <YAxis stroke="#64748b" fontSize={10} label={{ value: 'Force (N)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                <Line type="monotone" dataKey="rigid" stroke="#f43f5e" strokeWidth={2} dot={false} name="No Safety" opacity={safetyEnabled ? 0.3 : 1} />
                <Line type="monotone" dataKey="safety" stroke="#10b981" strokeWidth={3} dot={false} name="With Safety" opacity={safetyEnabled ? 1 : 0.3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Controls & Theory */}
      <div className="w-full lg:w-[400px] flex flex-col gap-6">
        <div className="glass-panel rounded-3xl p-8 border-white/5 space-y-6">
          <h3 className="text-sm font-black text-gold uppercase tracking-widest">Safety Configuration</h3>
          
          <div className="flex flex-col gap-4">
            <button 
              onClick={() => setSafetyEnabled(true)}
              className={cn(
                "p-4 rounded-2xl border transition-all flex items-center gap-4 text-left",
                safetyEnabled ? "bg-emerald-500/10 border-emerald-500 text-emerald-500" : "bg-white/5 border-white/5 text-slate-500 hover:bg-white/10"
              )}
            >
              <ShieldCheck size={24} />
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest">Crumple Zone & Airbag</div>
                <div className="text-[9px] opacity-60">Extended collision time (Δt)</div>
              </div>
            </button>

            <button 
              onClick={() => setSafetyEnabled(false)}
              className={cn(
                "p-4 rounded-2xl border transition-all flex items-center gap-4 text-left",
                !safetyEnabled ? "bg-rose-500/10 border-rose-500 text-rose-500" : "bg-white/5 border-white/5 text-slate-500 hover:bg-white/10"
              )}
            >
              <ShieldAlert size={24} />
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest">Rigid Structure</div>
                <div className="text-[9px] opacity-60">Instantaneous impact (Δt)</div>
              </div>
            </button>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => setIsPlaying(true)}
              disabled={isPlaying}
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-gold text-black font-black text-xs uppercase tracking-widest hover:scale-105 transition-all disabled:opacity-50"
            >
              Run Test <Play size={16} fill="currentColor" />
            </button>
            <button 
              onClick={reset}
              className="p-4 rounded-2xl bg-white/5 text-slate-500 hover:text-white transition-all border border-white/5"
            >
              <RotateCcw size={20} />
            </button>
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-8 border-white/5 flex-1 space-y-6">
          <div className="flex items-center gap-2 text-gold">
            <Info size={18} />
            <h3 className="text-sm font-black uppercase tracking-widest">VCE Exam Theory</h3>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-gold/5 border border-gold/10 space-y-3">
              <div className="text-[10px] font-black text-gold uppercase tracking-widest">The 2-Marker Logic</div>
              <p className="text-[10px] text-slate-400 leading-relaxed italic">
                "To answer a question about car safety, you must reference the impulse formula:"
              </p>
              <div className="font-mono text-xs text-white text-center py-2 bg-black/20 rounded-lg">
                F_avg = Δp / Δt
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                1. State that the <span className="text-white font-bold">change in momentum (Δp)</span> is constant for both scenarios (car stops from same speed).
              </p>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                2. Explain that safety features <span className="text-white font-bold">increase the collision time (Δt)</span>.
              </p>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                3. Conclude that since Δt is in the denominator, an increased Δt results in a <span className="text-emerald-400 font-bold font-black">decreased average force (F)</span> acting on the occupants.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <div className="text-[10px] font-black text-slate-500 uppercase mb-2">Impulse (Area)</div>
              <p className="text-[9px] text-slate-500 leading-relaxed">
                The area under BOTH curves is identical. This area represents the Impulse ($I = \Delta p$), which is the same because the car's mass and initial velocity are constant.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
