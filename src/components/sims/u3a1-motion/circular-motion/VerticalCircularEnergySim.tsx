import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, RotateCcw, Activity, Zap, Globe } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { cn } from '../../../utils';

export default function VerticalCircularEnergySim() {
  const [radius, setRadius] = useState(5); // m
  const [mass, setMass] = useState(2); // kg
  const [vTop, setVTop] = useState(8); // m/s at the top
  const [isPlaying, setIsPlaying] = useState(false);
  const [angle, setAngle] = useState(Math.PI / 2); // Start at top (90 deg)
  const [history, setHistory] = useState<any[]>([]);
  const [xAxisKey, setXAxisKey] = useState<'time' | 'x' | 'y'>('time');
  const [elapsedTime, setElapsedTime] = useState(0);

  const g = 9.8;
  
  // Total Energy (E = KE + GPE)
  // At top: h = 2R, v = vTop
  const energyTotal = 0.5 * mass * vTop * vTop + mass * g * (2 * radius);

  const requestRef = useRef<number>(null);
  const lastUpdateTimeRef = useRef<number>(null);

  const animate = (t: number) => {
    if (lastUpdateTimeRef.current !== undefined) {
      const deltaTime = (t - lastUpdateTimeRef.current) / 1000;
      
      // Conservation of energy: 0.5mv^2 + mgh = E_total
      // h = R + R*sin(theta) where theta is from center horizontal
      // But let's use angle from top: h = R + R*cos(angle) where angle=0 is top
      // Let's stick to standard: angle from center horizontal
      // h = R + R*sin(angle)
      // v = sqrt(2/m * (E_total - mgh))
      
      setAngle(prev => {
        const h = radius + radius * Math.sin(prev);
        const vSq = (2 / mass) * (energyTotal - mass * g * h);
        const v = Math.sqrt(Math.max(0, vSq));
        const omega = v / radius;
        const nextAngle = prev - omega * deltaTime; // clockwise
        
        // Update history for graph
        const curX = radius * Math.cos(prev);
        const curY = radius + radius * Math.sin(prev);
        const ke = 0.5 * mass * vSq;
        const gpe = mass * g * h;
        
        setElapsedTime(et => {
          const newEt = et + deltaTime;
          setHistory(prevH => {
            const newPoint = {
              time: Number(newEt.toFixed(2)),
              x: Number(curX.toFixed(2)),
              y: Number(curY.toFixed(2)),
              ke: Math.round(ke),
              gpe: Math.round(gpe),
              total: Math.round(ke + gpe)
            };
            // Keep last 100 points
            const nextH = [...prevH, newPoint];
            return nextH.length > 100 ? nextH.slice(nextH.length - 100) : nextH;
          });
          return newEt;
        });

        return nextAngle;
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
  }, [isPlaying, energyTotal]);

  const handleReset = () => {
    setIsPlaying(false);
    setAngle(Math.PI / 2);
    setHistory([]);
    setElapsedTime(0);
  };

  const curH = radius + radius * Math.sin(angle);
  const curX = radius * Math.cos(angle);
  const curY = curH;
  const curKE = energyTotal - mass * g * curH;
  const curGPE = mass * g * curH;

  return (
    <div className="w-full h-full flex flex-col p-8 gap-8">
      <div className="flex-1 flex gap-8">
        {/* Visual Area */}
        <div className="flex-1 glass-panel rounded-3xl relative overflow-hidden bg-slate-950/50 border-white/5 flex items-center justify-center">
          <div className="relative w-80 h-80">
            {/* Circular Track */}
            <div className="absolute inset-0 rounded-full border-2 border-white/5" />
            
            {/* Center Point */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white/20 rounded-full" />
            
            {/* String/Arm */}
            <div 
              className="absolute top-1/2 left-1/2 h-0.5 bg-gold/20 origin-left"
              style={{ 
                width: 160, 
                transform: `rotate(${-angle}rad)` 
              }}
            />

            {/* Ball */}
            <motion.div
              style={{
                left: 160 + 160 * Math.cos(angle),
                top: 160 - 160 * Math.sin(angle),
                x: '-50%',
                y: '-50%'
              }}
              className="absolute w-8 h-8 bg-gold rounded-full shadow-[0_0_30px_rgba(251,191,36,0.3)] flex items-center justify-center"
            >
              <div className="w-2 h-2 bg-black/20 rounded-full" />
            </motion.div>
          </div>

          {/* Stats Overlay */}
          <div className="absolute top-8 left-8 space-y-4">
            <div className="glass-panel px-6 py-4 rounded-2xl border-white/5">
              <div className="flex items-center gap-2 text-gold mb-3">
                <Zap size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Energy State</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between gap-8">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Kinetic</span>
                  <span className="text-sm font-black text-emerald-500">{Math.round(curKE)} J</span>
                </div>
                <div className="flex justify-between gap-8">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Potential</span>
                  <span className="text-sm font-black text-blue-500">{Math.round(curGPE)} J</span>
                </div>
                <div className="h-px bg-white/5 my-2" />
                <div className="flex justify-between gap-8">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Total</span>
                  <span className="text-sm font-black text-white">{Math.round(energyTotal)} J</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Graph Area */}
        <div className="w-[500px] glass-panel rounded-3xl p-8 border-white/5 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2 text-gold">
              <Activity size={18} />
              <span className="text-xs font-black uppercase tracking-widest">Energy Transformation</span>
            </div>
            <div className="flex bg-white/5 rounded-lg p-1">
              {(['time', 'x', 'y'] as const).map(key => (
                <button
                  key={key}
                  onClick={() => setXAxisKey(key)}
                  className={cn(
                    "px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest transition-all",
                    xAxisKey === key ? "bg-gold text-black" : "text-slate-500 hover:text-white"
                  )}
                >
                  {key}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis 
                  dataKey={xAxisKey} 
                  stroke="#64748b" 
                  fontSize={10} 
                  tickFormatter={(val) => val.toString()}
                  label={{ value: xAxisKey.toUpperCase(), position: 'insideBottom', offset: -5, fill: '#64748b', fontSize: 10 }}
                />
                <YAxis stroke="#64748b" fontSize={10} label={{ value: 'ENERGY (J)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'black', textTransform: 'uppercase', paddingTop: '20px' }} />
                <Line type="monotone" dataKey="ke" stroke="#10b981" strokeWidth={2} dot={false} name="Kinetic" isAnimationActive={false} />
                <Line type="monotone" dataKey="gpe" stroke="#3b82f6" strokeWidth={2} dot={false} name="Potential" isAnimationActive={false} />
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
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Radius (m)</label>
              <span className="text-xs font-black text-white">{radius}</span>
            </div>
            <input 
              type="range" min="1" max="10" value={radius} 
              onChange={(e) => setRadius(Number(e.target.value))}
              className="w-48 accent-gold"
            />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Mass (kg)</label>
              <span className="text-xs font-black text-white">{mass}</span>
            </div>
            <input 
              type="range" min="0.5" max="10" step="0.5" value={mass} 
              onChange={(e) => setMass(Number(e.target.value))}
              className="w-48 accent-gold"
            />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Speed at Top (m/s)</label>
              <span className="text-xs font-black text-white">{vTop}</span>
            </div>
            <input 
              type="range" min="1" max="20" value={vTop} 
              onChange={(e) => setVTop(Number(e.target.value))}
              className="w-48 accent-emerald-500"
            />
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
