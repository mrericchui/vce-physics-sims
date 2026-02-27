import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Zap, Activity, Info, ArrowDown, ArrowUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { cn } from '../../../utils';

type Perspective = 'forces' | 'energy';

export default function VerticalSpringSim() {
  const [mass, setMass] = useState(2); // kg
  const [k, setK] = useState(50); // N/m
  const [naturalLength, setNaturalLength] = useState(15); // m
  const [isPlaying, setIsPlaying] = useState(false);
  const [perspective, setPerspective] = useState<Perspective>('forces');
  
  const [y, setY] = useState(20); // displacement from top (downwards)
  const [v, setV] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [history, setHistory] = useState<any[]>([]);

  const g = 9.8;
  const platformHeight = 40; // m (reference for GPE)
  
  const requestRef = useRef<number>(null);
  const lastUpdateTimeRef = useRef<number>(null);

  // Equilibrium position: mg = k(y_eq - L0) => y_eq = L0 + mg/k
  const yEq = naturalLength + (mass * g) / k;

  const animate = (t: number) => {
    if (lastUpdateTimeRef.current !== undefined) {
      const deltaTime = Math.min((t - lastUpdateTimeRef.current) / 1000, 0.032);
      
      setY(prevY => {
        const extension = prevY - naturalLength;
        const springForce = -k * extension;
        const weight = mass * g;
        const netForce = weight + springForce;
        const acceleration = netForce / mass;

        const nextV = v + acceleration * deltaTime;
        const nextY = prevY + nextV * deltaTime;

        setV(nextV);

        // Energy Calculations
        const h = platformHeight - nextY;
        const gpe = mass * g * h;
        const ke = 0.5 * mass * nextV * nextV;
        const epe = 0.5 * k * Math.pow(Math.max(0, nextY - naturalLength), 2);

        setElapsedTime(et => {
          const newEt = et + deltaTime;
          if (Math.floor(newEt * 30) > Math.floor(et * 30)) {
            setHistory(prevH => {
              const newPoint = {
                time: Number(newEt.toFixed(2)),
                gpe: Math.round(gpe),
                ke: Math.round(ke),
                epe: Math.round(epe),
                total: Math.round(gpe + ke + epe)
              };
              return [...prevH, newPoint].slice(-100);
            });
          }
          return newEt;
        });

        return nextY;
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
    setY(naturalLength + 5); // Start slightly below natural length
    setV(0);
    setElapsedTime(0);
    setHistory([]);
  };

  const currentExtension = y - naturalLength;
  const currentFs = k * currentExtension;
  const currentWeight = mass * g;
  
  const currentH = platformHeight - y;
  const currentGPE = mass * g * currentH;
  const currentKE = 0.5 * mass * v * v;
  const currentEPE = 0.5 * k * Math.pow(Math.max(0, currentExtension), 2);

  return (
    <div className="w-full h-full flex flex-col p-8 gap-8 overflow-y-auto custom-scrollbar">
      <div className="flex-1 flex flex-col lg:flex-row gap-8 min-h-[500px]">
        {/* Visual Area */}
        <div className="flex-1 glass-panel rounded-3xl relative overflow-hidden bg-slate-950/50 border-white/5 flex justify-center p-12">
          {/* Ceiling */}
          <div className="absolute top-0 w-full h-4 bg-slate-900 border-b border-white/10" />
          
          {/* Spring Visual */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-full flex justify-center pointer-events-none">
            <svg width="100" height={y * 10} className="overflow-visible">
              <path
                d={`M 50 0 ${Array.from({ length: 30 }).map((_, i) => {
                  const py = (i / 29) * (y * 10);
                  const px = 50 + (i % 2 === 0 ? -15 : 15) * (i === 0 || i === 29 ? 0 : 1);
                  return `L ${px} ${py}`;
                }).join(' ')}`}
                fill="none"
                stroke="rgba(251, 191, 36, 0.4)"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Mass */}
          <motion.div
            style={{ top: 4 + y * 10 }}
            className="absolute left-1/2 -translate-x-1/2 w-20 h-20 bg-gold/10 border-2 border-gold/40 rounded-2xl flex items-center justify-center z-10"
          >
            <span className="text-gold font-black">{mass}kg</span>

            {/* Force Vectors (Perspective: Forces) */}
            {perspective === 'forces' && (
              <>
                {/* Spring Force (Up) */}
                <div className="absolute bottom-1/2 left-1/2 w-1 bg-emerald-500 origin-bottom -translate-y-full" style={{ height: Math.abs(currentFs) * 2 }}>
                  <ArrowUp size={16} className="absolute top-0 -left-[7px] text-emerald-500" />
                  <div className="absolute bottom-full mb-2 -left-4 text-[10px] font-black text-emerald-500 whitespace-nowrap">F_s = {currentFs.toFixed(1)}N</div>
                </div>
                {/* Weight (Down) */}
                <div className="absolute top-1/2 left-1/2 w-1 bg-rose-500 origin-top" style={{ height: currentWeight * 2 }}>
                  <ArrowDown size={16} className="absolute bottom-0 -left-[7px] text-rose-500" />
                  <div className="absolute top-full mt-2 -left-4 text-[10px] font-black text-rose-500 whitespace-nowrap">mg = {currentWeight.toFixed(1)}N</div>
                </div>
              </>
            )}
          </motion.div>

          {/* Natural Length Marker */}
          <div 
            className="absolute left-1/2 translate-x-[60px] w-10 border-t border-dashed border-white/20"
            style={{ top: 4 + naturalLength * 10 }}
          >
            <span className="absolute left-full ml-2 -top-2 text-[8px] font-black text-slate-500 uppercase whitespace-nowrap">Natural Length</span>
          </div>

          {/* Equilibrium Marker */}
          <div 
            className="absolute left-1/2 translate-x-[60px] w-10 border-t border-dashed border-gold/30"
            style={{ top: 4 + yEq * 10 }}
          >
            <span className="absolute left-full ml-2 -top-2 text-[8px] font-black text-gold/50 uppercase whitespace-nowrap">Equilibrium</span>
          </div>

          {/* Perspective Toggle */}
          <div className="absolute top-8 left-8 flex bg-white/5 rounded-xl p-1 border border-white/5">
            <button
              onClick={() => setPerspective('forces')}
              className={cn(
                "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                perspective === 'forces' ? "bg-gold text-black" : "text-slate-500 hover:text-white"
              )}
            >
              Forces
            </button>
            <button
              onClick={() => setPerspective('energy')}
              className={cn(
                "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                perspective === 'energy' ? "bg-gold text-black" : "text-slate-500 hover:text-white"
              )}
            >
              Energy
            </button>
          </div>
        </div>

        {/* Analysis Area */}
        <div className="w-full lg:w-[500px] flex flex-col gap-6">
          {perspective === 'energy' ? (
            <div className="flex-1 glass-panel rounded-3xl p-8 border-white/5 flex flex-col">
              <div className="flex items-center gap-2 text-gold mb-8">
                <Activity size={18} />
                <span className="text-xs font-black uppercase tracking-widest">Energy vs Time</span>
              </div>
              <div className="flex-1 min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={history}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="time" hide />
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
          ) : (
            <div className="flex-1 glass-panel rounded-3xl p-8 border-white/5 space-y-8">
              <div className="flex items-center gap-2 text-gold">
                <Info size={18} />
                <span className="text-xs font-black uppercase tracking-widest">Force Analysis</span>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Weight (mg)</span>
                  <span className="text-lg font-black text-rose-500">{currentWeight.toFixed(1)} N</span>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Spring Force (kΔx)</span>
                  <span className="text-lg font-black text-emerald-500">{currentFs.toFixed(1)} N</span>
                </div>
                <div className="p-4 rounded-2xl bg-gold/10 border border-gold/20 flex justify-between items-center">
                  <span className="text-[10px] font-bold text-gold uppercase">Net Force</span>
                  <span className="text-lg font-black text-white">{(currentWeight - currentFs).toFixed(1)} N</span>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">VCE Physics Note</div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  At the <span className="text-gold font-bold">Equilibrium Position</span>, the net force is zero ($mg = k\Delta x$). 
                  The object experiences maximum velocity at this point.
                </p>
              </div>
            </div>
          )}

          {/* Live Totals */}
          <div className="glass-panel rounded-3xl p-6 border-white/5 grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-[8px] font-black text-slate-500 uppercase mb-1">Velocity</div>
              <div className="text-sm font-black text-white">{v.toFixed(2)}m/s</div>
            </div>
            <div className="text-center">
              <div className="text-[8px] font-black text-slate-500 uppercase mb-1">Extension</div>
              <div className="text-sm font-black text-white">{currentExtension.toFixed(2)}m</div>
            </div>
            <div className="text-center">
              <div className="text-[8px] font-black text-slate-500 uppercase mb-1">Total Energy</div>
              <div className="text-sm font-black text-gold">{Math.round(currentGPE + currentKE + currentEPE)}J</div>
            </div>
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
            <input type="range" min="0.5" max="10" step="0.5" value={mass} onChange={(e) => setMass(Number(e.target.value))} className="w-48 accent-gold" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Spring Constant (k)</label>
              <span className="text-xs font-black text-white">{k}</span>
            </div>
            <input type="range" min="10" max="200" value={k} onChange={(e) => setK(Number(e.target.value))} className="w-48 accent-gold" />
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
