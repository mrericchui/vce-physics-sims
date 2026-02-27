import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SIMULATIONS, CURRICULUM, Simulation } from './types';
import { SimulationCard } from './components/SimulationCard';
import { Sidebar } from './components/Sidebar';
import { MainSidebar } from './components/MainSidebar';
import { Modal } from './components/Modal';
import ReactMarkdown from 'react-markdown';
import { Search, ChevronLeft, FlaskConical } from 'lucide-react';

export default function App() {
  const [selectedSimId, setSelectedSimId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<'theory' | 'notes' | null>(null);

  const selectedSim = SIMULATIONS.find(s => s.id === selectedSimId);

  const filteredSims = useMemo(() => {
    return SIMULATIONS.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.aos.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.topic.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTopic = activeTopic ? s.topic === activeTopic : true;
      return matchesSearch && matchesTopic;
    });
  }, [searchQuery, activeTopic]);

  const handleBackToHub = () => {
    setSelectedSimId(null);
    setActiveModal(null);
  };

  // Group simulations by AOS for the dashboard
  const groupedSims = useMemo(() => {
    const groups: Record<string, Simulation[]> = {};
    filteredSims.forEach(sim => {
      if (!groups[sim.aos]) groups[sim.aos] = [];
      groups[sim.aos].push(sim);
    });
    return groups;
  }, [filteredSims]);

  return (
    <div className="min-h-screen flex bg-midnight text-slate-200 overflow-hidden">
      {!selectedSimId && (
        <MainSidebar 
          activeTopic={activeTopic} 
          onTopicSelect={(topic) => setActiveTopic(topic === activeTopic ? null : topic)} 
        />
      )}

      <AnimatePresence mode="wait">
        {!selectedSimId ? (
          <motion.div
            key="hub"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 overflow-y-auto p-12 lg:p-20 custom-scrollbar"
          >
            <div className="max-w-7xl mx-auto">
              <header className="mb-20 flex flex-col lg:flex-row lg:items-start justify-between gap-12">
                <div className="flex-1">
                  <h1 className="text-7xl lg:text-[10rem] font-black text-white tracking-tighter leading-[0.8] mb-4">
                    Interactive<br />
                    <span className="text-white/5">Physics Laboratory</span>
                  </h1>
                  
                  <div className="flex items-center gap-12 mt-12">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mb-2">Active Simulations</p>
                      <span className="text-5xl font-black text-gold">
                        {SIMULATIONS.filter(s => s.isReady).length}
                      </span>
                    </div>
                    <div className="w-px h-12 bg-white/5" />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mb-2">Upcoming Simulations</p>
                      <span className="text-5xl font-black text-white/20">
                        {SIMULATIONS.filter(s => !s.isReady).length}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="relative group w-full lg:w-96">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-gold transition-colors" size={20} />
                  <input
                    type="text"
                    placeholder="Search concepts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-white/5 border border-white/5 rounded-full py-5 pl-16 pr-8 w-full focus:outline-none focus:border-gold/30 transition-all text-slate-200 placeholder:text-slate-700 font-bold text-sm"
                  />
                </div>
              </header>

              <div className="space-y-32">
                {Object.entries(groupedSims).map(([aos, sims]) => (
                  <section key={aos}>
                    <div className="flex items-center gap-6 mb-12">
                      <h2 className="text-4xl font-black text-white tracking-tighter uppercase">{aos}</h2>
                      <div className="flex-1 h-px bg-white/5" />
                    </div>

                    {/* Group by Topic within AOS */}
                    {Array.from(new Set(sims.map(s => s.topic))).map(topic => (
                      <div key={topic} className="mb-16 last:mb-0">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 mb-10">{topic}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                          {sims.filter(s => s.topic === topic).map((sim) => (
                            <SimulationCard
                              key={sim.id}
                              simulation={sim}
                              onClick={() => setSelectedSimId(sim.id)}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </section>
                ))}
              </div>

              {filteredSims.length === 0 && (
                <div className="text-center py-40 glass-panel rounded-[3rem] border-dashed border-2 border-white/5">
                  <p className="text-slate-600 text-xl font-black uppercase tracking-widest">No simulations found</p>
                </div>
              )}
            </div>

            {/* Floating Action Button */}
            <div className="fixed bottom-10 right-10">
              <button className="w-16 h-16 rounded-2xl bg-gold text-black flex items-center justify-center shadow-[0_0_30px_rgba(251,191,36,0.3)] hover:scale-110 transition-transform active:scale-95">
                <FlaskConical size={28} />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="viewer"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex h-screen overflow-hidden"
          >
            <Sidebar
              simulation={selectedSim!}
              onOpenTheory={() => setActiveModal('theory')}
              onOpenNotes={() => setActiveModal('notes')}
            />

            <main className="flex-1 flex flex-col relative bg-black">
              <div className="absolute top-8 left-8 z-10">
                <button
                  onClick={handleBackToHub}
                  className="flex items-center gap-3 px-6 py-3 rounded-2xl glass-panel hover:bg-white/10 transition-all text-slate-300 hover:text-white group border-white/5"
                >
                  <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                  <span className="text-xs font-black uppercase tracking-widest">Back to Hub</span>
                </button>
              </div>

              <div className="flex-1 flex items-center justify-center p-12">
                <div className="w-full h-full glass-panel rounded-[3rem] flex flex-col items-center justify-center text-center p-12 border-white/5">
                  <div className="w-32 h-32 rounded-full bg-gold/5 flex items-center justify-center text-gold/20 mb-12">
                    <FlaskConical size={64} />
                  </div>
                  <h2 className="text-4xl font-black text-white tracking-tighter mb-4">Simulation Environment</h2>
                  <p className="text-slate-500 max-w-md font-bold text-sm uppercase tracking-wider">
                    The interactive laboratory for <span className="text-gold">{selectedSim?.name}</span> is being prepared.
                  </p>
                </div>
              </div>

              <Modal
                isOpen={activeModal === 'theory'}
                onClose={() => setActiveModal(null)}
                title="Physics Theory"
              >
                <div className="markdown-body">
                  <ReactMarkdown>{selectedSim?.theory || ''}</ReactMarkdown>
                </div>
              </Modal>

              <Modal
                isOpen={activeModal === 'notes'}
                onClose={() => setActiveModal(null)}
                title="Teacher's Notes"
              >
                <div className="markdown-body">
                  <ReactMarkdown>{selectedSim?.teacherNotes || ''}</ReactMarkdown>
                </div>
              </Modal>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
