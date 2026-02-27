import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Activity, Zap, ArrowDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { cn } from '../../../utils';

export default function BungeeJumpSim() {
  const [mass, setMass] = useState(70); // kg
  const [k, setK] = useState(50); // N/m
  const [naturalLength, setNaturalLength] = useState(20); // m
  const [platformHeight, setPlatformHeight] = useState(50); // m
  const [isPlaying, setIsPlaying] = useState(false);
  
  const [y, setY] = useState(0); // displacement from top (downwards)
  const [v, setV] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [history, setHistory] = useState<any[]>([]);

  const g = 9.8;
  const requestRef = useRef<number>(null);
  const lastUpdateTimeRef = useRef<number>(null);

  const animate = (t: number) => {
    if (lastUpdateTimeRef.current !== undefined) {
      const deltaTime = Math.min((t - lastUpdateTimeRef.current) / 1000, 0.032); // Cap delta time for stability
      
      setY(prevY => {
        setV(prevV => {
          // Calculate Forces
          const weight = mass * g;
          const extension = Math.max(0, prevY - naturalLength);
          const springForce = -k * extension;
          const netForce = weight + springForce;
          const acceleration = netForce / mass;

          const nextV = prevV + acceleration * deltaTime;
          const nextY = prevY + nextV * deltaTime;

          // Energy Calculations
          const h = platformHeight - nextY;
          const gpe = mass * g * h;
          const ke = 0.5 * mass * nextV * nextV;
          const epe = 0.5 * k * extension * extension;

          setElapsedTime(et => {
            const newEt = et + deltaTime;
            if (Math.floor(newEt * 20) > Math.floor(et * 20)) { // Sample at 20Hz
              setHistory(prevH => {
                const newPoint = {
                  time: Number(newEt.toFixed(2)),
                  gpe: Math.round(gpe),
                  ke: Math.round(ke),
                  epe: Math.round(epe),
                  total: Math.round(gpe + ke + epe)
                };
                return [...prevH, newPoint].slice(-150);
              });
            }
            return newEt;
          });

          return nextV;
        });
        return prevY + v * deltaTime;
      });
    }
    lastUpdateTimeRef.current = t;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (isPlaying) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      lastUpdateTimeRef.current = undefined;
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, v]);

  const handleReset = () => {
    setIsPlaying(false);
    setY(0);
    setV(0);
    setElapsedTime(0);
    setHistory([]);
  };

  const currentExtension = Math.max(0, y - naturalLength);
  const currentH = platformHeight - y;
  const currentGPE = mass * g * currentH;
  const currentKE = 0.5 * mass * v * v;
  const currentEPE = 0.5 * k * currentExtension * currentExtension;

  return (
    <div className="w-full h-full flex flex-col p-8 gap-8">
      <div className="flex-1 flex gap-8 min-h-0">
        {/* Visual Area */}
        <div className="flex-1 glass-panel rounded-3xl relative overflow-hidden bg-slate-950/50 border-white/5 flex justify-center">
          {/* Platform */}
          <div className="absolute top-10 left-1/2 -translate-x-full w-20 h-4 bg-slate-800 border-b border-white/10" />
          
          {/* Bungee Cord */}
          <div 
            className="absolute top-10 left-1/2 w-0.5 bg-gold/30 origin-top"
            style={{ height: y * 10 }}
          />

          {/* Jumper */}
          <motion.div
            style={{ top: 10 + y * 10 }}
            className="absolute left-1/2 -translate-x-1/2 w-8 h-12 flex flex-col items-center"
          >
            <div className="w-4 h-4 rounded-full bg-gold border border-gold/50" />
            <div className="w-1 h-6 bg-gold/50" />
            <div className="w-4 h-1 bg-gold/50" />
          </motion.div>

          {/* Ground */}
          <div className="absolute bottom-0 w-full h-4 bg-emerald-900/20 border-t border-emerald-500/10" />

          {/* Stats Overlay */}
          <div className="absolute top-8 left-8 space-y-4">
            <div className="glass-panel px-6 py-4 rounded-2xl border-white/5">
              <div className="flex items-center gap-2 text-gold mb-3">
                <Zap size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Energy State</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between gap-8">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">GPE (Grav)</span>
                  <span className="text-sm font-black text-blue-500">{Math.round(currentGPE)} J</span>
                </div>
                <div className="flex justify-between gap-8">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">KE (Kinetic)</span>
                  <span className="text-sm font-black text-emerald-500">{Math.round(currentKE)} J</span>
                </div>
                <div className="flex justify-between gap-8">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">EPE (Elastic)</span>
                  <span className="text-sm font-black text-gold">{Math.round(currentEPE)} J</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Graph Area */}
        <div className="w-[500px] glass-panel rounded-3xl p-8 border-white/5 flex flex-col">
          <div className="flex items-center gap-2 text-gold mb-8">
            <Activity size={18} />
            <span className="text-xs font-black uppercase tracking-widest">Energy Transformation</span>
          </div>

          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="time" stroke="#64748b" fontSize={10} hide />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'black', textTransform: 'uppercase', paddingTop: '20px' }} />
                <Line type="monotone" dataKey="gpe" stroke="#3b82f6" strokeWidth={2} dot={false} name="GPE" isAnimationActive={false} />
                <Line type="monotone" dataKey="ke" stroke="#10b981" strokeWidth={2} dot={false} name="KE" isAnimationActive={false} />
                <Line type="monotone" dataKey="epe" stroke="#fbbf24" strokeWidth={2} dot={false} name="EPE" isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="glass-panel rounded-3xl p-8 flex items-center justify-between border-white/5">
        <div className="flex gap-12">
          <div className="space-y-4">
            <div className="flex justify-between">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Mass (kg)</label>
              <span className="text-xs font-black text-white">{mass}</span>
            </div>
            <input type="range" min="40" max="120" value={mass} onChange={(e) => setMass(Number(e.target.value))} className="w-40 accent-gold" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Spring Const (k)</label>
              <span className="text-xs font-black text-white">{k}</span>
            </div>
            <input type="range" min="10" max="200" value={k} onChange={(e) => setK(Number(e.target.value))} className="w-40 accent-gold" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Cord Length (m)</label>
              <span className="text-xs font-black text-white">{naturalLength}</span>
            </div>
            <input type="range" min="5" max="30" value={naturalLength} onChange={(e) => setNaturalLength(Number(e.target.value))} className="w-40 accent-gold" />
          </div>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-14 h-14 rounded-2xl bg-gold text-black flex items-center justify-center hover:scale-105 transition-transform active:scale-95"
          >
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
          </button>
          <button 
            onClick={handleReset}
            className="w-14 h-14 rounded-2xl bg-white/5 text-white flex items-center justify-center hover:bg-white/10 transition-all active:scale-95"
          >
            <RotateCcw size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
