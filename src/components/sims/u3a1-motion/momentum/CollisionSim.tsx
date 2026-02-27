import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'motion/react';
import { Play, RotateCcw, Info, Activity, ArrowRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '../../../utils';

interface CollisionState {
  m1: number;
  v1: number;
  m2: number;
  v2: number;
}

export default function CollisionSim() {
  const [m1, setM1] = useState(2);
  const [v1, setV1] = useState(4);
  const [m2, setM2] = useState(4);
  const [v2, setV2] = useState(-2);
  const [elasticity, setElasticity] = useState(1); // 1 = elastic, 0 = inelastic
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [beforeState, setBeforeState] = useState<CollisionState | null>(null);
  const [afterState, setAfterState] = useState<CollisionState | null>(null);
  
  const requestRef = useRef<number>(null);
  const startTimeRef = useRef<number>(null);

  // Positions
  const [pos1, setPos1] = useState(-150);
  const [pos2, setPos2] = useState(150);
  const [currentV1, setCurrentV1] = useState(4);
  const [currentV2, setCurrentV2] = useState(-2);

  const collisionOccurred = useRef(false);

  const reset = () => {
    setIsPlaying(false);
    setTime(0);
    setPos1(-150);
    setPos2(150);
    setCurrentV1(v1);
    setCurrentV2(v2);
    collisionOccurred.current = false;
    setBeforeState({ m1, v1, m2, v2 });
    setAfterState(null);
  };

  useEffect(() => {
    reset();
  }, [m1, v1, m2, v2, elasticity]);

  const animate = (t: number) => {
    if (!startTimeRef.current) startTimeRef.current = t;
    const dt = (t - startTimeRef.current) / 1000;
    startTimeRef.current = t;

    setPos1(prev => {
      const next = prev + currentV1 * dt * 50; // scale for pixels
      return next;
    });
    setPos2(prev => {
      const next = prev + currentV2 * dt * 50;
      return next;
    });

    setTime(prev => prev + dt);
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (isPlaying) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      startTimeRef.current = null;
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, currentV1, currentV2]);

  // Collision detection
  useEffect(() => {
    const width = 60; // block width
    if (!collisionOccurred.current && Math.abs(pos1 - pos2) < width) {
      collisionOccurred.current = true;
      
      // Conservation of Momentum: m1v1 + m2v2 = m1v1' + m2v2'
      // Coefficient of Restitution: e = (v2' - v1') / (v1 - v2)
      // v1' = [m1v1 + m2v2 - em2(v1-v2)] / (m1+m2)
      // v2' = [m1v1 + m2v2 + em1(v1-v2)] / (m1+m2)
      
      const v1_prime = (m1 * currentV1 + m2 * currentV2 - elasticity * m2 * (currentV1 - currentV2)) / (m1 + m2);
      const v2_prime = (m1 * currentV1 + m2 * currentV2 + elasticity * m1 * (currentV1 - currentV2)) / (m1 + m2);
      
      setCurrentV1(v1_prime);
      setCurrentV2(v2_prime);
      setAfterState({ m1, v1: v1_prime, m2, v2: v2_prime });
    }
  }, [pos1, pos2]);

  const forceData = useMemo(() => {
    const data = [];
    const collisionTime = 0.5; // arbitrary collision center
    const duration = 0.1;
    for (let i = 0; i <= 100; i++) {
      const t = i / 100;
      // Normal distribution for force peak
      const f = Math.exp(-Math.pow(t - collisionTime, 2) / (2 * Math.pow(duration/4, 2)));
      data.push({
        t: t.toFixed(2),
        f1: Number((f * 100).toFixed(1)),
        f2: Number((-f * 100).toFixed(1))
      });
    }
    return data;
  }, []);

  return (
    <div className="w-full h-full flex flex-col p-8 gap-8 overflow-y-auto custom-scrollbar">
      {/* Simulation Area */}
      <div className="h-[300px] glass-panel rounded-3xl relative overflow-hidden bg-slate-950/50 border-white/5 flex items-center justify-center">
        <div className="absolute top-6 left-6 flex items-center gap-2 text-gold">
          <Activity size={18} />
          <span className="text-[10px] font-black uppercase tracking-widest">Collision Chamber</span>
        </div>

        {/* Tracks */}
        <div className="absolute w-full h-1 bg-white/5 bottom-1/2 translate-y-8" />

        {/* Block 1 */}
        <motion.div 
          style={{ x: pos1 }}
          className="absolute w-[60px] h-[60px] bg-blue-500 rounded-xl border-2 border-blue-400 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.3)]"
        >
          <span className="text-[10px] font-black text-white">m₁ = {m1}kg</span>
          <span className="text-[10px] font-bold text-blue-200">{currentV1.toFixed(1)}m/s</span>
        </motion.div>

        {/* Block 2 */}
        <motion.div 
          style={{ x: pos2 }}
          className="absolute w-[60px] h-[60px] bg-rose-500 rounded-xl border-2 border-rose-400 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(244,63,94,0.3)]"
        >
          <span className="text-[10px] font-black text-white">m₂ = {m2}kg</span>
          <span className="text-[10px] font-bold text-rose-200">{currentV2.toFixed(1)}m/s</span>
        </motion.div>
      </div>

      {/* Snapshots Area */}
      <div className="grid grid-cols-2 gap-8 h-[180px]">
        <div className="glass-panel rounded-2xl p-6 border-white/5 flex flex-col gap-4">
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Before Collision</div>
          {beforeState && (
            <div className="flex justify-around items-center flex-1">
              <div className="text-center">
                <div className="text-xs font-bold text-blue-400">Obj 1</div>
                <div className="text-lg font-black text-white">{beforeState.v1} <span className="text-[10px] text-slate-500">m/s</span></div>
              </div>
              <ArrowRight className="text-slate-700" size={20} />
              <div className="text-center">
                <div className="text-xs font-bold text-rose-400">Obj 2</div>
                <div className="text-lg font-black text-white">{beforeState.v2} <span className="text-[10px] text-slate-500">m/s</span></div>
              </div>
            </div>
          )}
        </div>

        <div className="glass-panel rounded-2xl p-6 border-white/5 flex flex-col gap-4">
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">After Collision</div>
          {afterState ? (
            <div className="flex justify-around items-center flex-1">
              <div className="text-center">
                <div className="text-xs font-bold text-blue-400">Obj 1</div>
                <div className="text-lg font-black text-white">{afterState.v1.toFixed(2)} <span className="text-[10px] text-slate-500">m/s</span></div>
              </div>
              <ArrowRight className="text-slate-700" size={20} />
              <div className="text-center">
                <div className="text-xs font-bold text-rose-400">Obj 2</div>
                <div className="text-lg font-black text-white">{afterState.v2.toFixed(2)} <span className="text-[10px] text-slate-500">m/s</span></div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-[10px] text-slate-600 italic">Waiting for impact...</div>
          )}
        </div>
      </div>

      {/* Graphs Area */}
      <div className="h-[300px] glass-panel rounded-3xl p-8 border-white/5 flex flex-col">
        <div className="flex items-center gap-2 text-gold mb-6">
          <Activity size={16} />
          <span className="text-[10px] font-black uppercase tracking-widest">Force vs Time (Newton's 3rd Law)</span>
        </div>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={forceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="t" stroke="#64748b" fontSize={10} label={{ value: 'Time (s)', position: 'insideBottom', offset: -5, fill: '#64748b', fontSize: 10 }} />
              <YAxis stroke="#64748b" fontSize={10} label={{ value: 'Force (N)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
              <Tooltip contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
              <Line type="monotone" dataKey="f1" stroke="#3b82f6" strokeWidth={2} dot={false} name="F on Obj 1" />
              <Line type="monotone" dataKey="f2" stroke="#f43f5e" strokeWidth={2} dot={false} name="F on Obj 2" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Controls */}
      <div className="glass-panel rounded-3xl p-8 border-white/5 flex items-center justify-between">
        <div className="flex gap-8">
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Elasticity (e)</label>
            <div className="flex gap-2">
              <button 
                onClick={() => setElasticity(1)}
                className={cn("px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", elasticity === 1 ? "bg-gold text-black" : "bg-white/5 text-slate-500")}
              >Elastic</button>
              <button 
                onClick={() => setElasticity(0)}
                className={cn("px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", elasticity === 0 ? "bg-gold text-black" : "bg-white/5 text-slate-500")}
              >Inelastic</button>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mass 1 (kg)</label>
              <span className="text-xs font-black text-white">{m1}</span>
            </div>
            <input type="range" min="1" max="10" step="1" value={m1} onChange={(e) => setM1(Number(e.target.value))} className="w-32 accent-gold" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mass 2 (kg)</label>
              <span className="text-xs font-black text-white">{m2}</span>
            </div>
            <input type="range" min="1" max="10" step="1" value={m2} onChange={(e) => setM2(Number(e.target.value))} className="w-32 accent-gold" />
          </div>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gold text-black font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-gold/20"
          >
            {isPlaying ? 'Pause' : 'Start Simulation'} <Play size={16} fill="currentColor" />
          </button>
          <button 
            onClick={reset}
            className="p-4 rounded-2xl bg-white/5 text-slate-500 hover:text-white transition-all border border-white/5"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
