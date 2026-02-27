import React, { useState, useMemo } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import SimCard from './components/SimCard';
import PhysicsTutor from './components/PhysicsTutor';
import { PHYSICS_SIMS } from './constants';
import { AreaOfStudy } from './types';
import { Search, Layers, GraduationCap, Zap, ChevronLeft } from 'lucide-react';

const App: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<AreaOfStudy | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === '/';

  const filteredSims = useMemo(() => {
    return PHYSICS_SIMS.filter(sim => {
      const matchesFilter = activeFilter === 'all' || sim.aos === activeFilter;
      const matchesSearch = sim.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            sim.subtopic.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, searchTerm]);

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100 font-['Plus_Jakarta_Sans']">
      <Sidebar 
        onFilter={setActiveFilter} 
        onNavigate={(page) => navigate(page === 'home' ? '/' : `/${page}`)} 
        activeFilter={activeFilter} 
        activePage={isHomePage ? 'home' : (location.pathname.slice(1) as any)} 
      />

      <main className="flex-grow flex flex-col overflow-y-auto">
        <div className="flex-grow max-w-7xl w-full mx-auto px-6 py-12 lg:px-12">
          <Routes>
            <Route path="/" element={
              <div className="page-transition">
                <header className="mb-12">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                      <div className="flex items-center gap-2 text-amber-500 mb-2">
                         <GraduationCap size={18} />
                         <span className="text-xs font-black uppercase tracking-[0.2em]">Curriculum Module</span>
                      </div>
                      <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
                        {activeFilter === 'all' ? 'Unit 3 & 4 Simulations' : activeFilter}
                      </h2>
                      <p className="text-zinc-400 max-w-2xl leading-relaxed">
                        Interactive laboratory modules designed for the current VCAA Physics study design. 
                      </p>
                    </div>
                    
                    <div className="relative w-full md:w-80 group">
                      <Search className="absolute left-4 top-3.5 text-zinc-500 group-focus-within:text-amber-500" size={18} />
                      <input 
                        type="text" 
                        placeholder="Search concepts..."
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredSims.map(sim => (
                    <div key={sim.id} onClick={() => navigate(`/sim/${sim.id}`)} className="cursor-pointer">
                      <SimCard sim={sim} />
                    </div>
                  ))}
                </div>
              </div>
            } />

            <Route path="/sim/:simId" element={
              <div className="page-transition text-center py-20">
                <button onClick={() => navigate('/')} className="flex items-center gap-2 text-zinc-500 hover:text-white mb-8 mx-auto">
                  <ChevronLeft size={20} /> Back to Hub
                </button>
                <Layers size={48} className="mx-auto text-zinc-800 mb-4" />
                <h3 className="text-xl font-bold">Simulation View</h3>
                <p className="text-zinc-500">Module content loading...</p>
              </div>
            } />
          </Routes>
        </div>

        <footer className="p-12 border-t border-zinc-900 mt-auto bg-zinc-950/80">
          <div className="max-w-7xl mx-auto flex justify-between items-center text-[10px] text-zinc-500 uppercase tracking-widest font-black">
            <div className="flex items-center gap-2">
              <Zap size={14} className="text-amber-500 fill-amber-500" />
              <span className="text-white">Physics Sim Hub • 2026</span>
            </div>
            <span>VCAA Unit 3 & 4</span>
          </div>
        </footer>
      </main>

      <PhysicsTutor />
    </div>
  );
};

export default App;