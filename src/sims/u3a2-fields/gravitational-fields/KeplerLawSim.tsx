import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Info, Activity, Globe, Orbit, RotateCw, Plus, Trash2 } from 'lucide-react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line } from 'recharts';
import { cn } from '../../../utils';

interface Satellite {
  id: number;
  name: string;
  r: number; // m
  color: string;
}

export default function KeplerLawSim() {
  const [satellites, setSatellites] = useState<Satellite[]>([
    { id: 1, name: 'Sat A', r: 1e7, color: '#fbbf24' },
    { id: 2, name: 'Sat B', r: 2e7, color: '#3b82f6' }
  ]);

  const G = 6.674e-11;
  const M = 5.97e24; // Earth mass

  const calculatePeriod = (r: number) => {
    // T = 2 * pi * sqrt(r^3 / GM)
    return 2 * Math.PI * Math.sqrt(Math.pow(r, 3) / (G * M));
  };

  const graphData = useMemo(() => {
    return satellites.map(s => {
      const T = calculatePeriod(s.r);
      return {
        name: s.name,
        r3: Math.pow(s.r / 1e6, 3), // in (10^6 m)^3
        T2: Math.pow(T / 3600, 2), // in hours^2
        r: s.r,
        T: T
      };
    });
  }, [satellites]);

  const addSatellite = () => {
    if (satellites.length >= 5) return;
    const colors = ['#10b981', '#f43f5e', '#8b5cf6'];
    const newId = Math.max(0, ...satellites.map(s => s.id)) + 1;
    setSatellites([...satellites, {
      id: newId,
      name: `Sat ${String.fromCharCode(64 + newId)}`,
      r: 1.5e7 + Math.random() * 1e7,
      color: colors[satellites.length % colors.length]
    }]);
  };

  const removeSatellite = (id: number) => {
    if (satellites.length <= 1) return;
    setSatellites(satellites.filter(s => s.id !== id));
  };

  const updateRadius = (id: number, r: number) => {
    setSatellites(satellites.map(s => s.id === id ? { ...s, r } : s));
  };

  return (
    <div className="w-full h-full flex flex-col p-8 gap-8 lg:flex-row overflow-y-auto custom-scrollbar">
      {/* Visual Area */}
      <div className="flex-1 flex flex-col gap-8">
        <div className="flex-1 glass-panel rounded-3xl relative overflow-hidden bg-slate-950/50 border-white/5 flex items-center justify-center">
          <div className="absolute top-8 left-8 flex items-center gap-2 text-gold">
            <RotateCw size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">Orbital Motion</span>
          </div>

          <div className="relative w-full h-full flex items-center justify-center">
            {/* Earth */}
            <div className="relative z-10 text-blue-400">
              <Globe size={60} />
              <div className="absolute inset-0 bg-blue-400 opacity-10 blur-3xl rounded-full" />
            </div>

            {/* Orbits */}
            {satellites.map(s => {
              const T = calculatePeriod(s.r);
              const scale = (s.r / 3e7) * 400; // Scale for visualization
              return (
                <React.Fragment key={s.id}>
                  {/* Orbit Path */}
                  <div 
                    className="absolute border border-dashed border-white/10 rounded-full pointer-events-none"
                    style={{ width: scale, height: scale }}
                  />
                  {/* Satellite */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: T / 360, repeat: Infinity, ease: "linear" }}
                    className="absolute"
                    style={{ width: scale, height: scale }}
                  >
                    <div 
                      className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full shadow-lg border-2 border-white/20"
                      style={{ backgroundColor: s.color }}
                    >
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] font-black uppercase whitespace-nowrap" style={{ color: s.color }}>
                        {s.name}
                      </div>
                    </div>
                  </motion.div>
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Controls */}
        <div className="glass-panel rounded-3xl p-8 border-white/5 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-gold uppercase tracking-widest">Manage Satellites</h3>
            <button 
              onClick={addSatellite}
              disabled={satellites.length >= 5}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gold/10 text-gold border border-gold/20 hover:bg-gold/20 transition-all font-black text-[10px] uppercase tracking-widest disabled:opacity-50"
            >
              <Plus size={14} /> Add Orbit
            </button>
          </div>

          <div className="space-y-4">
            {satellites.map(s => (
              <div key={s.id} className="flex items-center gap-6 p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[10px] font-black text-slate-500 uppercase">{s.name} Radius (10⁶ m)</span>
                    <span className="text-[10px] font-black text-white">{(s.r / 1e6).toFixed(1)}</span>
                  </div>
                  <input 
                    type="range" min="7e6" max="3e7" step="1e5" value={s.r} 
                    onChange={(e) => updateRadius(s.id, Number(e.target.value))}
                    className="w-full accent-gold"
                  />
                </div>
                <button 
                  onClick={() => removeSatellite(s.id)}
                  className="p-2 text-slate-500 hover:text-rose-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Graphing Area */}
      <div className="w-full lg:w-[500px] flex flex-col gap-6">
        <div className="flex-1 glass-panel rounded-3xl p-8 border-white/5 flex flex-col">
          <div className="flex items-center gap-2 text-gold mb-8">
            <Activity size={18} />
            <span className="text-xs font-black uppercase tracking-widest">Kepler's 3rd Law: r³ vs T²</span>
          </div>

          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis 
                  type="number" dataKey="r3" name="r³" 
                  stroke="#64748b" fontSize={10} 
                  label={{ value: 'r³ (10¹⁸ m³)', position: 'insideBottom', offset: -10, fill: '#64748b', fontSize: 10 }} 
                />
                <YAxis 
                  type="number" dataKey="T2" name="T²" 
                  stroke="#64748b" fontSize={10} 
                  label={{ value: 'T² (hours²)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} 
                />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
                <Scatter name="Satellites" data={graphData} fill="#fbbf24" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-8 p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4">
            <div className="flex items-center gap-2 text-slate-500">
              <Info size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Analysis</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Kepler's Third Law states that the ratio {"$\\frac{r^3}{T^2}$"} is constant for all objects orbiting the same central body.
            </p>
            <div className="font-mono text-[10px] text-gold bg-gold/5 p-3 rounded-lg border border-gold/10">
              {"T² = (4π² / GM) * r³"}
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="glass-panel rounded-3xl p-6 border-white/5 space-y-4">
          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Orbital Data</h4>
          <div className="space-y-2">
            {graphData.map(d => (
              <div key={d.name} className="flex justify-between items-center p-2 rounded-lg bg-white/5 text-[10px]">
                <span className="font-bold text-white">{d.name}</span>
                <span className="text-slate-400">T = {(d.T / 3600).toFixed(2)} hrs</span>
                <span className="text-gold font-black">r³/T² = {(d.r3 / d.T2).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
