import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Info, MoveHorizontal, Zap, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { cn } from '../../../utils';

export default function SpringForceSim() {
  const [k, setK] = useState(100); // N/m
  const [extension, setExtension] = useState(0.5); // m
  
  const force = k * extension;
  const epe = 0.5 * k * extension * extension;

  // Data for the F-x graph
  const graphData = useMemo(() => {
    const data = [];
    const maxRange = 2.0;
    for (let x = 0; x <= maxRange; x += 0.1) {
      data.push({
        x: Number(x.toFixed(1)),
        f: k * x,
        // Area under graph up to current extension
        epeArea: x <= extension ? k * x : null
      });
    }
    return data;
  }, [k, extension]);

  return (
    <div className="w-full h-full flex flex-col p-8 gap-8 lg:flex-row overflow-y-auto custom-scrollbar">
      {/* Visual Area */}
      <div className="flex-1 flex flex-col gap-8">
        <div className="flex-1 glass-panel rounded-3xl relative overflow-hidden bg-slate-950/50 border-white/5 flex items-center justify-center p-12">
          <div className="relative w-full max-w-xl h-40 flex items-center">
            {/* Wall */}
            <div className="w-4 h-full bg-slate-800 border-r border-white/10" />
            
            {/* Spring (Visual representation) */}
            <div className="flex-1 h-12 relative flex items-center">
              <svg className="w-full h-full overflow-visible">
                <path
                  d={`M 0 24 ${Array.from({ length: 20 }).map((_, i) => {
                    const x = (i / 19) * (100 + extension * 150);
                    const y = 24 + (i % 2 === 0 ? -15 : 15);
                    return `L ${x} ${y}`;
                  }).join(' ')}`}
                  fill="none"
                  stroke="rgba(251, 191, 36, 0.5)"
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Mass */}
            <motion.div
              style={{ x: extension * 150 }}
              className="w-24 h-24 bg-gold/20 border-2 border-gold/50 rounded-xl flex items-center justify-center cursor-grab active:cursor-grabbing"
            >
              <span className="text-gold font-black">m</span>
              
              {/* Force Arrow */}
              <div className="absolute top-1/2 left-full flex items-center">
                <div className="h-1 bg-emerald-500" style={{ width: Math.abs(force) / 2 }} />
                <div className="w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-[8px] border-l-emerald-500" />
                <div className="absolute left-full ml-2 text-emerald-500 font-black text-[10px] whitespace-nowrap">F = {force.toFixed(1)}N</div>
              </div>
            </motion.div>
          </div>

          {/* Stats Overlay */}
          <div className="absolute top-8 left-8 space-y-4">
            <div className="glass-panel px-6 py-4 rounded-2xl border-white/5">
              <div className="flex items-center gap-2 text-gold mb-3">
                <Zap size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Stored Energy</span>
              </div>
              <div className="text-3xl font-black text-white">{epe.toFixed(2)} <span className="text-xs text-slate-500">J</span></div>
              <p className="text-[9px] text-slate-500 mt-2 uppercase tracking-widest font-bold">Elastic Potential Energy</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="glass-panel rounded-3xl p-8 border-white/5 flex items-center justify-between">
          <div className="flex gap-12">
            <div className="space-y-4">
              <div className="flex justify-between">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Spring Constant (N/m)</label>
                <span className="text-xs font-black text-white">{k}</span>
              </div>
              <input type="range" min="10" max="500" value={k} onChange={(e) => setK(Number(e.target.value))} className="w-64 accent-gold" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Extension (m)</label>
                <span className="text-xs font-black text-white">{extension}</span>
              </div>
              <input type="range" min="0" max="2" step="0.01" value={extension} onChange={(e) => setExtension(Number(e.target.value))} className="w-64 accent-gold" />
            </div>
          </div>
        </div>
      </div>

      {/* Graph Area */}
      <div className="w-full lg:w-[450px] glass-panel rounded-3xl p-8 border-white/5 flex flex-col">
        <div className="flex items-center gap-2 text-gold mb-8">
          <Activity size={18} />
          <span className="text-xs font-black uppercase tracking-widest">Force-Extension Graph</span>
        </div>

        <div className="flex-1 min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={graphData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="x" stroke="#64748b" fontSize={10} label={{ value: 'EXTENSION (m)', position: 'insideBottom', offset: -5, fill: '#64748b', fontSize: 10 }} />
              <YAxis stroke="#64748b" fontSize={10} label={{ value: 'FORCE (N)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                itemStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
              />
              <Area 
                type="monotone" 
                dataKey="epeArea" 
                stroke="none" 
                fill="rgba(251, 191, 36, 0.2)" 
                name="Stored Energy (Area)"
                isAnimationActive={false}
              />
              <Line type="monotone" dataKey="f" stroke="#fbbf24" strokeWidth={3} dot={false} name="Force" isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-8 p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4">
          <div className="flex items-center gap-2 text-slate-400">
            <Info size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">Analysis</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            The gradient of this line represents the <span className="text-gold font-bold text-[10px]">Spring Constant (k)</span>. 
            The shaded area represents the <span className="text-gold font-bold text-[10px]">Elastic Potential Energy (EPE)</span>.
          </p>
          <div className="font-mono text-[10px] text-white bg-black/40 p-3 rounded-lg border border-white/5">
            EPE = Area = ½ × base × height = ½ × x × (kx) = ½kx²
          </div>
        </div>
      </div>
    </div>
  );
}
