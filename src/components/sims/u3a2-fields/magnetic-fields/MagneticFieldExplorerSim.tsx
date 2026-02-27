import React, { useState, useRef, useMemo } from 'react';
import { motion } from 'motion/react';
import { Magnet, Zap, Eye, EyeOff, RotateCcw, Plus, Trash2, Move } from 'lucide-react';
import { cn } from '../../../utils';

type ElementType = 'bar-magnet' | 'straight-wire' | 'circular-loop' | 'solenoid';

interface MagElement {
  id: number;
  type: ElementType;
  x: number;
  y: number;
  strength: number;
  rotation: number;
}

export default function MagneticFieldExplorerSim() {
  const [elements, setElements] = useState<MagElement[]>([]);
  const [showVectors, setShowVectors] = useState(true);
  const [showLines, setShowLines] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [nextId, setNextId] = useState(1);

  const addElement = (type: ElementType) => {
    const newElement: MagElement = {
      id: nextId,
      type,
      x: 0.5,
      y: 0.5,
      strength: 1,
      rotation: 0
    };
    setElements([...elements, newElement]);
    setNextId(nextId + 1);
  };

  const updateElement = (id: number, updates: Partial<MagElement>) => {
    setElements(elements.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const removeElement = (id: number) => {
    setElements(elements.filter(e => e.id !== id));
  };

  const clearAll = () => {
    setElements([]);
    setNextId(1);
  };

  // Calculate magnetic field B at point (px, py)
  const getField = (px: number, py: number) => {
    let bx = 0;
    let by = 0;

    elements.forEach(el => {
      const dx = px - el.x;
      const dy = py - el.y;
      
      // Rotate coordinates to element's local frame
      const cos = Math.cos(-el.rotation);
      const sin = Math.sin(-el.rotation);
      const localX = dx * cos - dy * sin;
      const localY = dx * sin + dy * cos;

      let lbx = 0;
      let lby = 0;

      switch (el.type) {
        case 'bar-magnet': {
          // Dipole approximation
          const d = 0.05; // half-length
          const r1_2 = Math.pow(localX + d, 2) + Math.pow(localY, 2);
          const r2_2 = Math.pow(localX - d, 2) + Math.pow(localY, 2);
          const r1 = Math.sqrt(r1_2);
          const r2 = Math.sqrt(r2_2);
          
          // Field from North (+d, 0) and South (-d, 0)
          const k = 0.005 * el.strength;
          lbx = k * ((localX - d) / Math.pow(r2, 3) - (localX + d) / Math.pow(r1, 3));
          lby = k * (localY / Math.pow(r2, 3) - localY / Math.pow(r1, 3));
          break;
        }
        case 'straight-wire': {
          // B = mu0 * I / (2 * pi * r)
          const r2 = localX * localX + localY * localY;
          const r = Math.sqrt(r2);
          if (r < 0.01) break;
          const k = 0.0005 * el.strength;
          const mag = k / r;
          // Field is tangential: (-y, x)
          lbx = mag * (-localY / r);
          lby = mag * (localX / r);
          break;
        }
        case 'circular-loop': {
          // Simplified loop field
          const R = 0.05;
          const r2 = localX * localX + localY * localY;
          const r = Math.sqrt(r2);
          if (r < 0.01) break;
          const k = 0.001 * el.strength;
          // On axis field is strong, off axis decays
          const mag = k * Math.pow(R, 2) / Math.pow(r2 + R*R, 1.5);
          lbx = mag; // Simplified axial field
          lby = 0;
          break;
        }
        case 'solenoid': {
          const L = 0.15;
          const R = 0.04;
          const k = 0.002 * el.strength;
          // Inside uniform, outside dipole-like
          if (Math.abs(localX) < L/2 && Math.abs(localY) < R) {
            lbx = k;
            lby = 0;
          } else {
            const r2 = localX * localX + localY * localY;
            const mag = k * 0.1 / Math.pow(r2, 1.5);
            lbx = mag * (localX / Math.sqrt(r2));
            lby = mag * (localY / Math.sqrt(r2));
          }
          break;
        }
      }

      // Rotate field back to global frame
      const gbx = lbx * Math.cos(el.rotation) - lby * Math.sin(el.rotation);
      const gby = lbx * Math.sin(el.rotation) + lby * Math.cos(el.rotation);
      bx += gbx;
      by += gby;
    });

    return { bx, by, mag: Math.sqrt(bx * bx + by * by) };
  };

  const vectorGrid = useMemo(() => {
    if (!showVectors) return [];
    const grid = [];
    const steps = 20;
    for (let i = 0; i <= steps; i++) {
      for (let j = 0; j <= steps; j++) {
        const px = i / steps;
        const py = j / steps;
        const field = getField(px, py);
        if (field.mag > 0.0001) {
          grid.push({ x: px, y: py, ...field });
        }
      }
    }
    return grid;
  }, [elements, showVectors]);

  return (
    <div className="w-full h-full flex flex-col p-8 gap-8">
      <div className="flex-1 glass-panel rounded-3xl relative overflow-hidden bg-slate-950/50 border-white/5" ref={containerRef}>
        {/* Vector Field Layer */}
        {showVectors && (
          <div className="absolute inset-0 pointer-events-none opacity-40">
            {vectorGrid.map((v, i) => {
              const angle = Math.atan2(v.by, v.bx);
              const length = Math.min(20, v.mag * 5000);
              return (
                <div 
                  key={i}
                  className="absolute w-0.5 bg-gold/60"
                  style={{ 
                    left: `${v.x * 100}%`, 
                    top: `${v.y * 100}%`,
                    height: length,
                    transform: `rotate(${angle + Math.PI/2}rad)`,
                    transformOrigin: 'center'
                  }}
                />
              );
            })}
          </div>
        )}

        {/* Elements */}
        {elements.map(el => (
          <motion.div
            key={el.id}
            drag
            dragMomentum={false}
            onDrag={(_, info) => {
              if (!containerRef.current) return;
              const rect = containerRef.current.getBoundingClientRect();
              const newX = (info.point.x - rect.left) / rect.width;
              const newY = (info.point.y - rect.top) / rect.height;
              updateElement(el.id, { x: Math.max(0, Math.min(1, newX)), y: Math.max(0, Math.min(1, newY)) });
            }}
            style={{ 
              left: `${el.x * 100}%`, 
              top: `${el.y * 100}%`,
              x: '-50%',
              y: '-50%',
              rotate: `${el.rotation * (180/Math.PI)}deg`
            }}
            className={cn(
              "absolute flex items-center justify-center cursor-grab active:cursor-grabbing z-20 group",
              el.type === 'bar-magnet' ? "w-32 h-8" : "w-12 h-12"
            )}
          >
            {el.type === 'bar-magnet' && (
              <div className="w-full h-full flex rounded-md overflow-hidden border border-white/20 shadow-xl">
                <div className="flex-1 bg-rose-600 flex items-center justify-center text-[10px] font-black text-white">N</div>
                <div className="flex-1 bg-slate-700 flex items-center justify-center text-[10px] font-black text-white">S</div>
              </div>
            )}
            {el.type === 'straight-wire' && (
              <div className="w-4 h-full bg-slate-400 rounded-full border border-white/20 shadow-xl flex items-center justify-center">
                <div className="w-1 h-full bg-gold/50" />
              </div>
            )}
            {el.type === 'circular-loop' && (
              <div className="w-10 h-10 rounded-full border-4 border-slate-400 shadow-xl" />
            )}
            {el.type === 'solenoid' && (
              <div className="w-24 h-10 flex gap-1 items-center justify-center">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="w-2 h-full bg-slate-400 rounded-full border border-white/10" />
                ))}
              </div>
            )}

            {/* Controls on Hover */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 hidden group-hover:flex gap-2 bg-black/80 backdrop-blur-md p-2 rounded-xl border border-white/10 z-30">
              <button 
                onClick={() => updateElement(el.id, { rotation: el.rotation + Math.PI/4 })}
                className="p-1.5 hover:bg-white/10 rounded-lg text-gold"
              >
                <RotateCcw size={14} />
              </button>
              <button 
                onClick={() => removeElement(el.id)}
                className="p-1.5 hover:bg-rose-500/20 rounded-lg text-rose-500"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </motion.div>
        ))}

        {/* Empty State Hint */}
        {elements.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-sm font-black uppercase tracking-widest animate-pulse">
            Add magnetic elements to explore the field
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="glass-panel rounded-3xl p-8 flex items-center justify-between border-white/5">
        <div className="flex gap-4">
          <button 
            onClick={() => addElement('bar-magnet')}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500/20 transition-all font-black text-xs uppercase tracking-widest"
          >
            <Magnet size={16} /> Bar Magnet
          </button>
          <button 
            onClick={() => addElement('straight-wire')}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gold/10 text-gold border border-gold/20 hover:bg-gold/20 transition-all font-black text-xs uppercase tracking-widest"
          >
            <Zap size={16} /> Wire
          </button>
          <button 
            onClick={() => addElement('circular-loop')}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20 hover:bg-blue-500/20 transition-all font-black text-xs uppercase tracking-widest"
          >
            <RotateCcw size={16} /> Loop
          </button>
          <button 
            onClick={() => addElement('solenoid')}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all font-black text-xs uppercase tracking-widest"
          >
            <Move size={16} /> Solenoid
          </button>
        </div>

        <div className="flex gap-4 items-center">
          <div className="h-8 w-px bg-white/10 mx-4" />
          <button 
            onClick={() => setShowVectors(!showVectors)}
            className={cn(
              "p-3 rounded-xl transition-all",
              showVectors ? "bg-gold text-black" : "bg-white/5 text-slate-500"
            )}
            title="Toggle Vectors"
          >
            {showVectors ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
          <button 
            onClick={clearAll}
            className="p-3 rounded-xl bg-white/5 text-slate-500 hover:text-rose-500 transition-all"
            title="Clear All"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
