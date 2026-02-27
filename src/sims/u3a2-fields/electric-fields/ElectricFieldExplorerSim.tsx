import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, RotateCcw, Eye, EyeOff, Info, Move } from 'lucide-react';
import { cn } from '../../../utils';

interface Charge {
  id: number;
  x: number;
  y: number;
  q: number; // in arbitrary units, e.g., +1 or -1
}

export default function ElectricFieldExplorerSim() {
  const [charges, setCharges] = useState<Charge[]>([]);
  const [showVectors, setShowVectors] = useState(true);
  const [showLines, setShowLines] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [nextId, setNextId] = useState(1);

  const k = 1000; // Constant for visualization

  const addCharge = (q: number) => {
    const newCharge: Charge = {
      id: nextId,
      x: 0.5,
      y: 0.5,
      q
    };
    setCharges([...charges, newCharge]);
    setNextId(nextId + 1);
  };

  const addDipole = () => {
    const id1 = nextId;
    const id2 = nextId + 1;
    setCharges([
      ...charges,
      { id: id1, x: 0.4, y: 0.5, q: 1 },
      { id: id2, x: 0.6, y: 0.5, q: -1 }
    ]);
    setNextId(nextId + 2);
  };

  const updateChargePos = (id: number, x: number, y: number) => {
    setCharges(charges.map(c => c.id === id ? { ...c, x, y } : c));
  };

  const removeCharge = (id: number) => {
    setCharges(charges.filter(c => c.id !== id));
  };

  const clearAll = () => {
    setCharges([]);
    setNextId(1);
  };

  // Calculate field at point (px, py)
  const getField = (px: number, py: number) => {
    let ex = 0;
    let ey = 0;
    charges.forEach(c => {
      const dx = px - c.x;
      const dy = py - c.y;
      const r2 = dx * dx + dy * dy;
      const r = Math.sqrt(r2);
      if (r < 0.02) return; // Avoid singularity
      const mag = (k * c.q) / r2;
      ex += mag * (dx / r);
      ey += mag * (dy / r);
    });
    return { ex, ey, mag: Math.sqrt(ex * ex + ey * ey) };
  };

  // Generate vector grid
  const vectorGrid = useMemo(() => {
    if (!showVectors) return [];
    const grid = [];
    const steps = 20;
    for (let i = 0; i <= steps; i++) {
      for (let j = 0; j <= steps; j++) {
        const px = i / steps;
        const py = j / steps;
        const field = getField(px, py);
        if (field.mag > 0.01) {
          grid.push({ x: px, y: py, ...field });
        }
      }
    }
    return grid;
  }, [charges, showVectors]);

  // Field line tracing (simplified)
  const fieldLines = useMemo(() => {
    if (!showLines || charges.length === 0) return [];
    const lines: string[] = [];
    const stepSize = 0.01;
    const maxSteps = 100;

    charges.filter(c => c.q > 0).forEach(c => {
      const numLines = 12;
      for (let i = 0; i < numLines; i++) {
        const startAngle = (i / numLines) * 2 * Math.PI;
        let curX = c.x + 0.02 * Math.cos(startAngle);
        let curY = c.y + 0.02 * Math.sin(startAngle);
        let path = `M ${curX * 100}% ${curY * 100}%`;

        for (let s = 0; s < maxSteps; s++) {
          const field = getField(curX, curY);
          if (field.mag < 0.1) break;
          curX += (field.ex / field.mag) * stepSize;
          curY += (field.ey / field.mag) * stepSize;
          path += ` L ${curX * 100}% ${curY * 100}%`;
          
          // Stop if near any charge
          const nearCharge = charges.some(other => {
            const d = Math.sqrt((curX - other.x)**2 + (curY - other.y)**2);
            return d < 0.02;
          });
          if (nearCharge || curX < 0 || curX > 1 || curY < 0 || curY > 1) break;
        }
        lines.push(path);
      }
    });

    return lines;
  }, [charges, showLines]);

  return (
    <div className="w-full h-full flex flex-col p-8 gap-8">
      <div className="flex-1 glass-panel rounded-3xl relative overflow-hidden bg-slate-950/50 border-white/5" ref={containerRef}>
        {/* Vector Field Layer */}
        {showVectors && (
          <div className="absolute inset-0 pointer-events-none opacity-40">
            {vectorGrid.map((v, i) => {
              const angle = Math.atan2(v.ey, v.ex);
              const length = Math.min(20, v.mag / 50);
              return (
                <div 
                  key={i}
                  className="absolute w-0.5 bg-white/40"
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

        {/* Field Lines Layer */}
        {showLines && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-60">
            {fieldLines.map((path, i) => (
              <path key={i} d={path} stroke="rgba(251, 191, 36, 0.5)" fill="none" strokeWidth="1.5" />
            ))}
          </svg>
        )}

        {/* Charges */}
        {charges.map(c => (
          <motion.div
            key={c.id}
            drag
            dragMomentum={false}
            onDrag={(_, info) => {
              if (!containerRef.current) return;
              const rect = containerRef.current.getBoundingClientRect();
              const newX = (info.point.x - rect.left) / rect.width;
              const newY = (info.point.y - rect.top) / rect.height;
              updateChargePos(c.id, Math.max(0, Math.min(1, newX)), Math.max(0, Math.min(1, newY)));
            }}
            style={{ 
              left: `${c.x * 100}%`, 
              top: `${c.y * 100}%`,
              x: '-50%',
              y: '-50%'
            }}
            className={cn(
              "absolute w-10 h-10 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing z-20 shadow-lg",
              c.q > 0 ? "bg-rose-500 text-white" : "bg-blue-500 text-white"
            )}
          >
            {c.q > 0 ? <Plus size={20} /> : <Minus size={20} />}
            <button 
              onClick={(e) => { e.stopPropagation(); removeCharge(c.id); }}
              className="absolute -top-2 -right-2 w-5 h-5 bg-black/50 rounded-full text-[10px] flex items-center justify-center hover:bg-rose-600 transition-colors"
            >
              ×
            </button>
          </motion.div>
        ))}

        {/* Empty State Hint */}
        {charges.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-sm font-bold uppercase tracking-widest animate-pulse">
            Add charges to explore the field
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="glass-panel rounded-3xl p-8 flex items-center justify-between border-white/5">
        <div className="flex gap-4">
          <button 
            onClick={() => addCharge(1)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500/20 transition-all font-black text-xs uppercase tracking-widest"
          >
            <Plus size={16} /> Positive
          </button>
          <button 
            onClick={() => addCharge(-1)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20 hover:bg-blue-500/20 transition-all font-black text-xs uppercase tracking-widest"
          >
            <Minus size={16} /> Negative
          </button>
          <button 
            onClick={addDipole}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gold/10 text-gold border border-gold/20 hover:bg-gold/20 transition-all font-black text-xs uppercase tracking-widest"
          >
            <Move size={16} /> Dipole
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
            onClick={() => setShowLines(!showLines)}
            className={cn(
              "p-3 rounded-xl transition-all",
              showLines ? "bg-gold text-black" : "bg-white/5 text-slate-500"
            )}
            title="Toggle Field Lines"
          >
            <RotateCcw size={20} className={cn(showLines && "rotate-45")} />
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
