import React, { useState, useMemo } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import SimCard from './components/SimCard';
import PhysicsTutor from './components/PhysicsTutor';
import { PHYSICS_SIMS } from './constants';
import { AreaOfStudy } from './types';
import { Search, Github, Twitter, Layers, GraduationCap, Zap, Info, ShieldCheck } from 'lucide-react';

// Placeholder for Simulation components
const ProjectileMotionSim = () => (
  <div className="p-8">
    <h2 className="text-3xl font-bold mb-4">Projectile Motion Simulation</h2>
    <p className="text-zinc-400">Loading module sims/u3a1/projectile-motion...</p>
    <Link to="/" className="text-amber-500 hover:underline mt-4 block">Return to Hub</Link>
  </div>
);

const App: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<AreaOfStudy | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const filteredSims = useMemo(() => {
    return PHYSICS_SIMS.filter(sim => {
      const matchesFilter = activeFilter === 'all' || sim.aos === activeFilter;
      const matchesSearch = sim.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            sim.subtopic.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            sim.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, searchTerm]);

  const handleNavigate = (page: 'home' | 'about' | 'legal') => {
    if (page === 'home') navigate('/');
    else navigate(`/${page}`);
  };

  const HubContent = (
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
              Visualising abstract concepts to solidify core theoretical understanding.
            </p>
          </div>
          
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-4 top-3.5 text-zinc-500 group-focus-within:text-amber-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search concepts..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all border-zinc-800 hover:border-zinc-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredSims.length > 0 ? (
          filteredSims.map(sim => (
            <SimCard key={sim.id} sim={sim} />
          ))
        ) : (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-zinc-900 rounded-3xl">
            <Layers size={48} className="mx-auto text-zinc-800 mb-4" />
            <h3 className="text-zinc-500 font-bold">No simulations found matching "{searchTerm}"</h3>
            <button onClick={() => {setSearchTerm(''); setActiveFilter('all');}} className="mt-4 text-amber-500 text-sm hover:underline">Clear all filters</button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100">
      <Sidebar 
        onFilter={setActiveFilter} 
        onNavigate={handleNavigate} 
        activeFilter={activeFilter} 
        activePage={location.pathname === '/' ? 'home' : location.pathname.substring(1)} 
      />

      <main className="flex-grow flex flex-col">
        <div className="flex-grow max-w-7xl w-full mx-auto px-6 py-12 lg:px-12">
          <Routes>
            <Route path="/" element={HubContent} />
            <Route path="/about" element={
              <div className="page-transition max-w-3xl">
                <h2 className="text-4xl font-bold text-white mb-8">Educator's Note</h2>
                <div className="prose prose-invert space-y-6 text-zinc-400 leading-relaxed text-lg">
                  <p>
                    Welcome, physics students and teachers. This portal is designed as a <span className="text-white font-semibold">Virtual Laboratory</span>. 
                    In Year 12 Physics, we often deal with concepts that are invisible to the naked eye—point charges, magnetic flux, and matter waves.
                  </p>
                  <p>
                    These simulations are meant to bridge the gap between abstract mathematical formulas and visual reality. 
                    I encourage you to push the sliders to their limits, break the physics, and observe how systems react at extremes.
                  </p>
                  <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
                    <h4 className="text-amber-500 font-bold mb-2">How to use this hub:</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Filter by <span className="text-zinc-200">Area of Study</span> to focus on your current SAC.</li>
                      <li>• Check the <span className="text-zinc-200">Difficulty tags</span> to gauge your mastery.</li>
                      <li>• Use the <span className="text-zinc-200">AI Tutor</span> if you're stuck on the "Why" behind a simulation.</li>
                    </ul>
                  </div>
                  <p>Physics is not just about memorising the formula sheet; it's about understanding the laws that govern our universe. Happy experimenting.</p>
                  <div className="pt-4">
                    <p className="text-white font-bold italic">Mr. Eric Chui</p>
                    <p className="text-zinc-500 text-sm">VCE Physics / STEM / Science Teacher</p>
                  </div>
                </div>
              </div>
            } />
            <Route path="/legal" element={
              <div className="page-transition max-w-3xl">
                <h2 className="text-4xl font-bold text-white mb-8">Licensing & Legal</h2>
                <div className="grid gap-8">
                  <section className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800">
                    <h3 className="text-xl font-bold text-white mb-4">Educational Use</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                      The simulations provided here are supplementary educational tools. While significant effort is made to ensure physical accuracy within a reasonable margin, these should not be used as the primary source for calculations where high-precision scientific accuracy is required.
                    </p>
                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-zinc-500">
                      <span className="bg-zinc-800 px-2 py-1 rounded">VCAA Disclaimer</span>
                      <span>Not endorsed by the Victorian Curriculum and Assessment Authority.</span>
                    </div>
                  </section>
                  <section className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800">
                    <h3 className="text-xl font-bold text-white mb-4">Intellectual Property</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                      Content created by Mr. Eric Chui is licensed under <span className="text-amber-500 font-bold">Creative Commons BY-NC 4.0</span>. You are free to share and adapt the material for non-commercial educational purposes.
                    </p>
                  </section>
                </div>
              </div>
            } />
            <Route path="/projectile-motion" element={<ProjectileMotionSim />} />
          </Routes>
        </div>

        <footer className="p-12 border-t border-zinc-900 mt-auto bg-zinc-950/80 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                 <Zap size={14} className="text-amber-500 fill-amber-500" />
                 <span className="text-xs font-black uppercase tracking-widest text-white">Physics Sim Hub</span>
              </div>
              <p className="text-zinc-500 text-[11px] max-w-md leading-relaxed">
                Copyright © 2026 Mr. Eric Chui. Designed for Victorian Certificate of Education students. 
                Built with precision, fuelled by coffee and kinematic equations.
              </p>
            </div>
            
            <div className="flex gap-6 items-center">
              <a href="#" className="text-zinc-600 hover:text-white transition-colors"><Twitter size={20} /></a>
              <a href="#" className="text-zinc-600 hover:text-white transition-colors"><Github size={20} /></a>
              <div className="h-4 w-px bg-zinc-800"></div>
              <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">Physics 12 • 2026</p>
            </div>
          </div>
        </footer>
      </main>

      <PhysicsTutor />
    </div>
  );
};

export default App;