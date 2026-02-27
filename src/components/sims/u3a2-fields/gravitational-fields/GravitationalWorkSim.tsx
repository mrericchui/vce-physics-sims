import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Info, Activity, ArrowRight, Globe, Zap } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { cn } from '../../../utils';

export default function GravitationalWorkSim() {
  const [mass, setMass] = useState(1000); // kg
  const [r1, setR1] = useState(6.37e6); // m (Surface)
  const [r2, setR2] = useState(1.2e7); // m
  
  const G = 6.674e-11;
  const M = 5.97e24; // Earth mass

  // Calculate work done: W = G M m (1/r1 - 1/r2)
  const workDone = G * M * mass * (1/r1 - 1/r2);

  const graphData = useMemo(() => {
    const data = [];
    const minR = 6.37e6;
    const maxR = 3e7;
    const steps = 50;
    
    for (let i = 0; i <= steps; i++) {
      const currentR = minR + (i / steps) * (maxR - minR);
      const g = (G * M) / (currentR * currentR);
      const f = g * mass;
      
      data.push({
        r: currentR / 1e6, // in millions of meters
        g: Number(g.toFixed(3)),
        f: Number(f.toFixed(0)),
        // Area under graph between r1 and r2
        isHighlighted: currentR >= Math.min(r1, r2) && currentR <= Math.max(r1, r2)
      });
    }
    return data;
  }, [r1, r2, mass]);

  return (
    <div className="w-full h-full flex flex-col p-8 gap-8 overflow-y-auto custom-scrollbar">
      {/* Visual Area */}
      <div className="h-[400px] flex gap-8">
        {/* 3D-ish Animation */}
        <div className="flex-1 glass-panel rounded-3xl relative overflow-hidden bg-slate-950/50 border-white/5 flex items-center justify-center">
          <div className="absolute top-6 left-6 flex items-center gap-2 text-gold">
            <Globe size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">3D Perspective</span>
          </div>

          <div className="relative w-full h-full flex items-center justify-center perspective-[1000px]">
            {/* Earth */}
            <div className="relative z-10 text-blue-400">
              <Globe size={100} />
              <div className="absolute inset-0 bg-blue-400 opacity-10 blur-3xl rounded-full" />
            </div>

            {/* Path Line */}
            <div className="absolute w-[400px] h-px bg-white/10 border-t border-dashed border-white/20" />

            {/* Object at R1 */}
            <div 
              className="absolute w-4 h-4 bg-slate-500 rounded-full border border-white/20"
              style={{ left: `calc(50% + ${(r1 / 1e6) * 10}px)` }}
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] font-black text-slate-500 uppercase">R1</div>
            </div>

            {/* Object at R2 */}
            <motion.div 
              animate={{ x: (r2 / 1e6) * 10 }}
              className="absolute w-6 h-6 bg-gold rounded-lg border border-gold/50 shadow-[0_0_20px_rgba(251,191,36,0.3)] flex items-center justify-center"
              style={{ left: '50%' }}
            >
              <span className="text-[8px] font-black text-black">m</span>
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] font-black text-gold uppercase">R2</div>
            </motion.div>
          </div>
        </div>

        {/* 2D Diagram (Exam Style) */}
        <div className="w-[400px] glass-panel rounded-3xl relative overflow-hidden bg-slate-950/50 border-white/5 flex items-center justify-center p-8">
          <div className="absolute top-6 left-6 flex items-center gap-2 text-gold">
            <Info size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">2D Exam Diagram</span>
          </div>

          <svg className="w-full h-full" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="30" fill="rgba(59, 130, 246, 0.2)" stroke="rgba(59, 130, 246, 0.5)" strokeWidth="2" />
            <text x="100" y="105" textAnchor="middle" className="fill-blue-400 text-[10px] font-bold">M</text>
            
            <line x1="130" y1="100" x2="180" y2="100" stroke="rgba(255,255,255,0.2)" strokeDasharray="2 2" />
            
            <circle cx={100 + (r1 / 1e7) * 50} cy="100" r="4" fill="rgba(148, 163, 184, 0.5)" />
            <text x={100 + (r1 / 1e7) * 50} y="115" textAnchor="middle" className="fill-slate-500 text-[8px] font-bold">r₁</text>
            
            <circle cx={100 + (r2 / 1e7) * 50} cy="100" r="6" fill="rgba(251, 191, 36, 0.5)" />
            <text x={100 + (r2 / 1e7) * 50} y="115" textAnchor="middle" className="fill-gold text-[8px] font-bold">r₂</text>

            <path d={`M ${100 + (r1 / 1e7) * 50} 90 Q 140 80 ${100 + (r2 / 1e7) * 50} 90`} fill="none" stroke="rgba(251, 191, 36, 0.5)" strokeWidth="1" markerEnd="url(#arrow)" />
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(251, 191, 36, 0.5)" />
              </marker>
            </defs>
          </svg>
        </div>
      </div>

      {/* Graphs Area */}
      <div className="flex gap-8 h-[350px]">
        {/* Field Strength Graph */}
        <div className="flex-1 glass-panel rounded-3xl p-8 border-white/5 flex flex-col">
          <div className="flex items-center gap-2 text-gold mb-6">
            <Activity size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Field Strength (g) vs Distance (r)</span>
          </div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={graphData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="r" stroke="#64748b" fontSize={10} label={{ value: 'r (10⁶ m)', position: 'insideBottom', offset: -5, fill: '#64748b', fontSize: 10 }} />
                <YAxis stroke="#64748b" fontSize={10} label={{ value: 'g (N/kg)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="g" stroke="#3b82f6" fill="rgba(59, 130, 246, 0.1)" dot={false} isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Force Graph */}
        <div className="flex-1 glass-panel rounded-3xl p-8 border-white/5 flex flex-col">
          <div className="flex items-center gap-2 text-gold mb-6">
            <Activity size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Force (F) vs Distance (r)</span>
          </div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={graphData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="r" stroke="#64748b" fontSize={10} label={{ value: 'r (10⁶ m)', position: 'insideBottom', offset: -5, fill: '#64748b', fontSize: 10 }} />
                <YAxis stroke="#64748b" fontSize={10} label={{ value: 'F (N)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                <Area 
                  type="monotone" 
                  dataKey="f" 
                  stroke="#fbbf24" 
                  fill="rgba(251, 191, 36, 0.2)" 
                  dot={false} 
                  isAnimationActive={false}
                  // Custom logic to highlight area between r1 and r2 would go here if recharts supported it easily
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="glass-panel rounded-3xl p-8 border-white/5 flex items-center justify-between">
        <div className="flex gap-12">
          <div className="space-y-4">
            <div className="flex justify-between">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Object Mass (kg)</label>
              <span className="text-xs font-black text-white">{mass}</span>
            </div>
            <input type="range" min="100" max="5000" step="100" value={mass} onChange={(e) => setMass(Number(e.target.value))} className="w-48 accent-gold" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Start Radius R1 (10⁶ m)</label>
              <span className="text-xs font-black text-white">{(r1 / 1e6).toFixed(2)}</span>
            </div>
            <input type="range" min="6.37" max="25" step="0.1" value={r1 / 1e6} onChange={(e) => setR1(Number(e.target.value) * 1e6)} className="w-48 accent-gold" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">End Radius R2 (10⁶ m)</label>
              <span className="text-xs font-black text-white">{(r2 / 1e6).toFixed(2)}</span>
            </div>
            <input type="range" min="6.37" max="25" step="0.1" value={r2 / 1e6} onChange={(e) => setR2(Number(e.target.value) * 1e6)} className="w-48 accent-gold" />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-gold/10 border border-gold/20 flex flex-col items-center min-w-[200px]">
          <div className="text-[10px] font-black text-gold uppercase tracking-widest mb-1">Work Done (Area)</div>
          <div className="text-2xl font-black text-white">{(workDone / 1e6).toFixed(2)} <span className="text-xs text-slate-500">MJ</span></div>
          <p className="text-[8px] text-slate-500 mt-2 italic text-center">Area under the F-r graph.</p>
        </div>
      </div>
    </div>
  );
}
