import { LucideIcon } from 'lucide-react';

export type Unit = 'Unit 3' | 'Unit 4';
export type Difficulty = 'Fundamental' | 'Intermediate' | 'Advanced';

export interface Simulation {
  id: string;
  name: string;
  unit: Unit;
  aos: string;
  topic: string;
  subtopic: string;
  description: string;
  theory: string;
  teacherNotes: string;
  icon: string;
  difficulty: Difficulty;
  tags: string[];
  isReady: boolean;
}

export interface AreaOfStudy {
  id: string;
  code: string; // e.g., U3A1
  unit: Unit;
  title: string;
  topics: {
    name: string;
    subtopics: string[];
  }[];
}

export const CURRICULUM: AreaOfStudy[] = [
  {
    id: 'u3-aos1',
    code: 'U3A1',
    unit: 'Unit 3',
    title: 'MOTION',
    topics: [
      { name: 'NEWTONS LAWS', subtopics: ['Contact Forces', 'Linked Objects', 'Pulley Systems'] },
      { name: 'PROJECTILE MOTION', subtopics: ['Projectile Motion'] },
      { name: 'CIRCULAR MOTION', subtopics: ['Banked Tracks', 'Conical Pendulums', 'Vertical Circular Motion'] },
      { name: 'ENERGY', subtopics: ['Bungee Jumps', 'Spring Energy', 'Spring Forces'] },
      { name: 'MOMENTUM', subtopics: ['Collisions', 'Impulse'] }
    ]
  },
  {
    id: 'u3-aos2',
    code: 'U3A2',
    unit: 'Unit 3',
    title: 'FIELDS',
    topics: [
      { name: 'ELECTRIC FIELDS', subtopics: ['Charge Configurations', 'Parallel Plates', 'Point Charges'] },
      { name: 'GRAVITATIONAL FIELDS', subtopics: ['Field Strength', 'Gravitational Work', 'Orbits'] },
      { name: 'MAGNETIC FIELDS', subtopics: ['Magnetic Fields', 'Magnetic Force'] },
      { name: 'FIELD COMPARISON', subtopics: [] }
    ]
  },
  {
    id: 'u3-aos3',
    code: 'U3A3',
    unit: 'Unit 3',
    title: 'ELECTRICITY',
    topics: [
      { name: 'GENERATION', subtopics: ['AC Generation', 'Faradays Law', 'Lenzs Law', 'Magnetic Flux'] },
      { name: 'TRANSMISSION', subtopics: ['Power Loss'] }
    ]
  },
  {
    id: 'u4-aos1',
    code: 'U4A1',
    unit: 'Unit 4',
    title: 'MODERN PHYSICS',
    topics: [
      { name: 'WAVE PARTICLE DUALITY OF LIGHT', subtopics: ['Diffraction', 'Double Slit', 'Interference', 'Light Duality', 'Standing Waves', 'Superposition'] },
      { name: 'WAVE PARTICLE DUALITY OF MATTER', subtopics: ['Matter Duality'] },
      { name: 'RELATIVITY', subtopics: ['Time Dilation', 'Length Contraction'] }
    ]
  }
];

export const SIMULATIONS: Simulation[] = [
  // U3A1 - Motion
  {
    id: 'banked-track',
    name: 'Banked Track Sim',
    unit: 'Unit 3',
    aos: 'U3A1 MOTION',
    topic: 'CIRCULAR MOTION',
    subtopic: 'Banked Tracks',
    description: 'Analyse the forces on a vehicle traversing a banked curve without relying on friction.',
    theory: '### Banked Tracks\n\nWhen a track is banked at an angle $\\theta$, the normal force has a horizontal component that provides the centripetal force: $N \\sin \\theta = mv^2/r$.',
    teacherNotes: 'Discuss the "ideal speed" where no friction is required.',
    icon: 'RotateCw',
    difficulty: 'Intermediate',
    tags: ['CIRCULAR MOTION', 'BANKED TRACK', 'CENTRIPETAL FORCE'],
    isReady: false
  },
  {
    id: 'conical-pendulum',
    name: 'Conical Pendulum Sim',
    unit: 'Unit 3',
    aos: 'U3A1 MOTION',
    topic: 'CIRCULAR MOTION',
    subtopic: 'Conical Pendulums',
    description: 'Study the motion of a mass swinging in a horizontal circle.',
    theory: '### Conical Pendulum\n\nThe tension in the string provides both the vertical support and the centripetal force.',
    teacherNotes: 'Compare period with a simple pendulum.',
    icon: 'Tally1',
    difficulty: 'Intermediate',
    tags: ['PENDULUM', 'CIRCULAR MOTION'],
    isReady: false
  },
  {
    id: 'vertical-circular',
    name: 'Vertical Circular Sim',
    unit: 'Unit 3',
    aos: 'U3A1 MOTION',
    topic: 'CIRCULAR MOTION',
    subtopic: 'Vertical Circular Motion',
    description: 'Explore the changing tension and normal forces at different points in a vertical loop.',
    theory: '### Vertical Circular Motion\n\nAt the top of the loop, $F_{net} = T + mg = mv^2/r$. At the bottom, $F_{net} = T - mg = mv^2/r$.',
    teacherNotes: 'Focus on the "critical speed" at the top of the loop.',
    icon: 'RefreshCw',
    difficulty: 'Advanced',
    tags: ['CIRCULAR MOTION', 'VERTICAL LOOP'],
    isReady: false
  },
  {
    id: 'bungee-jump',
    name: 'Bungee Jump Sim',
    unit: 'Unit 3',
    aos: 'U3A1 MOTION',
    topic: 'ENERGY',
    subtopic: 'Bungee Jumps',
    description: 'Simulate the energy transformations in a bungee jump, from gravitational to elastic potential energy.',
    theory: '### Energy in Bungee Jumping\n\nConservation of energy: $mgh = \\frac{1}{2}kx^2$.',
    teacherNotes: 'Discuss where maximum acceleration and maximum velocity occur.',
    icon: 'ArrowDown',
    difficulty: 'Advanced',
    tags: ['ENERGY', 'ELASTICITY', 'GRAVITY'],
    isReady: false
  },
  {
    id: 'spring-energy',
    name: 'Spring Energy Sim',
    unit: 'Unit 3',
    aos: 'U3A1 MOTION',
    topic: 'ENERGY',
    subtopic: 'Spring Energy',
    description: 'Visualise the work done in compressing or stretching a spring.',
    theory: '### Elastic Potential Energy\n\n$E_p = \\frac{1}{2}kx^2$. This is the area under a Force-Extension graph.',
    teacherNotes: 'Relate the area under the graph to the energy formula.',
    icon: 'Zap',
    difficulty: 'Fundamental',
    tags: ['SPRING', 'ENERGY', 'HOOKES LAW'],
    isReady: false
  },
  {
    id: 'spring-force',
    name: 'Spring Force Sim',
    unit: 'Unit 3',
    aos: 'U3A1 MOTION',
    topic: 'ENERGY',
    subtopic: 'Spring Forces',
    description: 'Investigate Hooke\'s Law and the relationship between force and extension.',
    theory: '### Hooke\'s Law\n\n$F = kx$.',
    teacherNotes: 'Use to find the spring constant of different materials.',
    icon: 'MoveVertical',
    difficulty: 'Fundamental',
    tags: ['FORCE', 'SPRING', 'HOOKES LAW'],
    isReady: false
  },
  {
    id: 'collision-sim',
    name: 'Collision Sim',
    unit: 'Unit 3',
    aos: 'U3A1 MOTION',
    topic: 'MOMENTUM',
    subtopic: 'Collisions',
    description: 'Simulate elastic and inelastic collisions between two objects.',
    theory: '### Conservation of Momentum\n\n$m_1u_1 + m_2u_2 = m_1v_1 + m_2v_2$.',
    teacherNotes: 'Compare kinetic energy before and after to determine elasticity.',
    icon: 'Combine',
    difficulty: 'Intermediate',
    tags: ['MOMENTUM', 'COLLISION', 'ENERGY'],
    isReady: false
  },
  {
    id: 'impulse-sim',
    name: 'Impulse Sim',
    unit: 'Unit 3',
    aos: 'U3A1 MOTION',
    topic: 'MOMENTUM',
    subtopic: 'Impulse',
    description: 'Study how force and time affect the change in momentum of an object.',
    theory: '### Impulse\n\n$I = F\\Delta t = \\Delta p$.',
    teacherNotes: 'Relate to crumple zones in cars.',
    icon: 'Zap',
    difficulty: 'Intermediate',
    tags: ['IMPULSE', 'MOMENTUM', 'FORCE'],
    isReady: false
  },
  {
    id: 'contact-forces',
    name: 'Contact Forces Sim',
    unit: 'Unit 3',
    aos: 'U3A1 MOTION',
    topic: 'NEWTONS LAWS',
    subtopic: 'Contact Forces',
    description: 'Analyse the normal and frictional forces acting on objects in contact.',
    theory: '### Newton\'s Third Law\n\nFor every action, there is an equal and opposite reaction.',
    teacherNotes: 'Focus on drawing correct free body diagrams.',
    icon: 'Move',
    difficulty: 'Fundamental',
    tags: ['FORCES', 'NEWTONS LAWS'],
    isReady: false
  },
  {
    id: 'linked-objects',
    name: 'Linked Objects Sim',
    unit: 'Unit 3',
    aos: 'U3A1 MOTION',
    topic: 'NEWTONS LAWS',
    subtopic: 'Linked Objects',
    description: 'Study the acceleration and tension in systems of connected masses.',
    theory: '### Systems of Masses\n\n$a = \\frac{\\Sigma F}{\\Sigma m}$.',
    teacherNotes: 'Show how internal forces (tension) cancel out when considering the whole system.',
    icon: 'Link',
    difficulty: 'Intermediate',
    tags: ['TENSION', 'ACCELERATION', 'SYSTEMS'],
    isReady: false
  },
  {
    id: 'pulley-system',
    name: 'Pulley System Sim',
    unit: 'Unit 3',
    aos: 'U3A1 MOTION',
    topic: 'NEWTONS LAWS',
    subtopic: 'Pulley Systems',
    description: 'Simulate Atwood machines and other pulley configurations.',
    theory: '### Pulleys\n\nPulleys change the direction of the tension force.',
    teacherNotes: 'Great for multi-body problems.',
    icon: 'Dna',
    difficulty: 'Intermediate',
    tags: ['PULLEY', 'FORCES', 'TENSION'],
    isReady: false
  },
  {
    id: 'projectile-sim',
    name: 'Projectile Sim',
    unit: 'Unit 3',
    aos: 'U3A1 MOTION',
    topic: 'PROJECTILE MOTION',
    subtopic: 'Projectile Motion',
    description: 'Classic projectile motion simulation with trajectory tracking.',
    theory: '### Projectile Motion\n\nIndependent horizontal and vertical components.',
    teacherNotes: 'Vary launch height and angle.',
    icon: 'Zap',
    difficulty: 'Intermediate',
    tags: ['PROJECTILE', 'KINEMATICS'],
    isReady: false
  },

  // U3A2 - Fields
  {
    id: 'charge-config',
    name: 'Charge Config Sim',
    unit: 'Unit 3',
    aos: 'U3A2 FIELDS',
    topic: 'ELECTRIC FIELDS',
    subtopic: 'Charge Configurations',
    description: 'Visualise electric field lines for various arrangements of point charges.',
    theory: '### Electric Fields\n\n$E = kQ/r^2$.',
    teacherNotes: 'Show null points where fields cancel.',
    icon: 'Zap',
    difficulty: 'Intermediate',
    tags: ['ELECTRIC FIELD', 'CHARGES'],
    isReady: false
  },
  {
    id: 'parallel-plate',
    name: 'Parallel Plate Sim',
    unit: 'Unit 3',
    aos: 'U3A2 FIELDS',
    topic: 'ELECTRIC FIELDS',
    subtopic: 'Parallel Plates',
    description: 'Study the uniform electric field between two charged parallel plates.',
    theory: '### Uniform Fields\n\n$E = V/d$.',
    teacherNotes: 'Discuss the motion of a charge entering the field.',
    icon: 'Menu',
    difficulty: 'Intermediate',
    tags: ['ELECTRIC FIELD', 'VOLTAGE'],
    isReady: false
  },
  {
    id: 'point-charges',
    name: 'Point Charges Sim',
    unit: 'Unit 3',
    aos: 'U3A2 FIELDS',
    topic: 'ELECTRIC FIELDS',
    subtopic: 'Point Charges',
    description: 'Calculate the force between two point charges using Coulomb\'s Law.',
    theory: '### Coulomb\'s Law\n\n$F = kQ_1Q_2/r^2$.',
    teacherNotes: 'Verify the inverse square relationship.',
    icon: 'Dot',
    difficulty: 'Fundamental',
    tags: ['COULOMBS LAW', 'FORCE'],
    isReady: false
  },
  {
    id: 'field-comparison',
    name: 'Field Comparison Sim',
    unit: 'Unit 3',
    aos: 'U3A2 FIELDS',
    topic: 'FIELD COMPARISON',
    subtopic: 'Field Comparison',
    description: 'Compare the properties of gravitational, electric, and magnetic fields.',
    theory: '### Field Similarities\n\nGravitational and Electric fields both follow inverse square laws.',
    teacherNotes: 'Highlight that gravity is always attractive, while electric can be both.',
    icon: 'Columns',
    difficulty: 'Intermediate',
    tags: ['FIELDS', 'COMPARISON'],
    isReady: false
  },
  {
    id: 'grav-field-sim',
    name: 'Gravitational Field Sim',
    unit: 'Unit 3',
    aos: 'U3A2 FIELDS',
    topic: 'GRAVITATIONAL FIELDS',
    subtopic: 'Field Strength',
    description: 'Map the gravitational field strength around planets and stars.',
    theory: '### Gravitational Field Strength\n\n$g = GM/r^2$.',
    teacherNotes: 'Compare g on different planets.',
    icon: 'Globe',
    difficulty: 'Fundamental',
    tags: ['GRAVITY', 'FIELDS'],
    isReady: false
  },
  {
    id: 'grav-work-sim',
    name: 'Gravitational Work Sim',
    unit: 'Unit 3',
    aos: 'U3A2 FIELDS',
    topic: 'GRAVITATIONAL FIELDS',
    subtopic: 'Gravitational Work',
    description: 'Calculate the work done in moving a mass through a non-uniform gravitational field.',
    theory: '### Work in Fields\n\n$W = \Delta E_p$. Area under a Force-Distance graph.',
    teacherNotes: 'Introduce the concept of gravitational potential.',
    icon: 'ArrowUp',
    difficulty: 'Advanced',
    tags: ['WORK', 'ENERGY', 'GRAVITY'],
    isReady: false
  },
  {
    id: 'orbit-sim',
    name: 'Orbit Sim',
    unit: 'Unit 3',
    aos: 'U3A2 FIELDS',
    topic: 'GRAVITATIONAL FIELDS',
    subtopic: 'Orbits',
    description: 'Simulate satellite orbits and Kepler\'s Laws.',
    theory: '### Orbital Motion\n\n$v = \sqrt{GM/r}$.',
    teacherNotes: 'Show geostationary orbits.',
    icon: 'Orbit',
    difficulty: 'Intermediate',
    tags: ['ORBIT', 'SATELLITE', 'KEPLER'],
    isReady: false
  },
  {
    id: 'mag-field-sim',
    name: 'Magnetic Field Sim',
    unit: 'Unit 3',
    aos: 'U3A2 FIELDS',
    topic: 'MAGNETIC FIELDS',
    subtopic: 'Magnetic Fields',
    description: 'Visualise magnetic fields around wires, loops, and solenoids.',
    theory: '### Magnetic Fields from Currents\n\nRight-hand grip rule.',
    teacherNotes: 'Show how solenoid fields resemble bar magnets.',
    icon: 'Magnet',
    difficulty: 'Intermediate',
    tags: ['MAGNETISM', 'CURRENT'],
    isReady: false
  },
  {
    id: 'magnetic-sim',
    name: 'Magnetic Sim',
    unit: 'Unit 3',
    aos: 'U3A2 FIELDS',
    topic: 'MAGNETIC FIELDS',
    subtopic: 'Magnetic Force',
    description: 'Study the force on a moving charge or current-carrying wire in a magnetic field.',
    theory: '### Magnetic Force\n\n$F = qvB \sin \theta$ or $F = nILB \sin \theta$.',
    teacherNotes: 'Use the right-hand palm rule.',
    icon: 'Zap',
    difficulty: 'Intermediate',
    tags: ['FORCE', 'MAGNETISM'],
    isReady: false
  },

  // U3A3 - Electricity
  {
    id: 'faradays-law',
    name: 'Faradays Law Sim',
    unit: 'Unit 3',
    aos: 'U3A3 ELECTRICITY',
    topic: 'GENERATION',
    subtopic: 'Faradays Law',
    description: 'Demonstrate electromagnetic induction by moving a magnet through a coil.',
    theory: '### Faraday\'s Law\n\n$\epsilon = -N \frac{\Delta \Phi}{\Delta t}$.',
    teacherNotes: 'Show how speed of motion affects induced EMF.',
    icon: 'Zap',
    difficulty: 'Intermediate',
    tags: ['INDUCTION', 'EMF'],
    isReady: false
  },
  {
    id: 'ac-gen',
    name: 'AC Gen Sim',
    unit: 'Unit 3',
    aos: 'U3A3 ELECTRICITY',
    topic: 'GENERATION',
    subtopic: 'AC Generation',
    description: 'Simulate a rotating coil in a magnetic field to produce alternating current.',
    theory: '### AC Generation\n\nSinusoidal EMF production.',
    teacherNotes: 'Relate rotation speed to frequency.',
    icon: 'RefreshCw',
    difficulty: 'Advanced',
    tags: ['AC', 'GENERATOR'],
    isReady: false
  },
  {
    id: 'lenzs-law',
    name: 'Lenzs Law Sim',
    unit: 'Unit 3',
    aos: 'U3A3 ELECTRICITY',
    topic: 'GENERATION',
    subtopic: 'Lenzs Law',
    description: 'Explore the direction of induced current and conservation of energy.',
    theory: '### Lenz\'s Law\n\nInduced current creates a field that opposes the change that created it.',
    teacherNotes: 'Crucial for understanding conservation of energy in induction.',
    icon: 'Shield',
    difficulty: 'Intermediate',
    tags: ['LENZ', 'INDUCTION'],
    isReady: false
  },
  {
    id: 'mag-flux',
    name: 'Magnetic Flux Sim',
    unit: 'Unit 3',
    aos: 'U3A3 ELECTRICITY',
    topic: 'GENERATION',
    subtopic: 'Magnetic Flux',
    description: 'Visualise magnetic flux through a loop at different angles.',
    theory: '### Magnetic Flux\n\n$\Phi = BA \cos \theta$.',
    teacherNotes: 'Show when flux is maximum vs zero.',
    icon: 'Grid',
    difficulty: 'Fundamental',
    tags: ['FLUX', 'MAGNETISM'],
    isReady: false
  },
  {
    id: 'power-loss',
    name: 'Power Loss Sim',
    unit: 'Unit 3',
    aos: 'U3A3 ELECTRICITY',
    topic: 'TRANSMISSION',
    subtopic: 'Power Loss',
    description: 'Simulate power transmission and the role of step-up transformers in reducing line loss.',
    theory: '### Power Loss\n\n$P_{loss} = I^2R$.',
    teacherNotes: 'Demonstrate why high voltage is used for transmission.',
    icon: 'ZapOff',
    difficulty: 'Advanced',
    tags: ['POWER', 'TRANSMISSION', 'TRANSFORMER'],
    isReady: false
  },

  // U4A1 - Modern Physics
  {
    id: 'relativity-sim',
    name: 'Relativity Sim',
    unit: 'Unit 4',
    aos: 'U4A1 MODERN PHYSICS',
    topic: 'RELATIVITY',
    subtopic: 'Time Dilation',
    description: 'Visualise time dilation and length contraction at relativistic speeds.',
    theory: '### Special Relativity\n\n$t = t_0 \gamma$.',
    teacherNotes: 'Use the light clock thought experiment.',
    icon: 'Clock',
    difficulty: 'Advanced',
    tags: ['RELATIVITY', 'TIME', 'LORENTZ'],
    isReady: false
  },
  {
    id: 'diffraction-sim',
    name: 'Diffraction Sim',
    unit: 'Unit 4',
    aos: 'U4A1 MODERN PHYSICS',
    topic: 'WAVE PARTICLE DUALITY OF LIGHT',
    subtopic: 'Diffraction',
    description: 'Observe wave bending through single slits.',
    theory: '### Diffraction\n\nBending of waves around obstacles.',
    teacherNotes: 'Compare light vs sound diffraction.',
    icon: 'Grid',
    difficulty: 'Intermediate',
    tags: ['DIFFRACTION', 'WAVES'],
    isReady: false
  },
  {
    id: 'double-slit',
    name: 'Double Slit Sim',
    unit: 'Unit 4',
    aos: 'U4A1 MODERN PHYSICS',
    topic: 'WAVE PARTICLE DUALITY OF LIGHT',
    subtopic: 'Double Slit',
    description: 'Classic Young\'s double slit experiment simulation.',
    theory: '### Interference Patterns\n\n$\Delta x = \lambda L / d$.',
    teacherNotes: 'Show how slit separation affects fringe spacing.',
    icon: 'Menu',
    difficulty: 'Advanced',
    tags: ['INTERFERENCE', 'YOUNG'],
    isReady: false
  },
  {
    id: 'interference-sim',
    name: 'Interference Sim',
    unit: 'Unit 4',
    aos: 'U4A1 MODERN PHYSICS',
    topic: 'WAVE PARTICLE DUALITY OF LIGHT',
    subtopic: 'Interference',
    description: 'General wave interference simulation.',
    theory: '### Constructive and Destructive Interference\n\nPhase difference.',
    teacherNotes: 'Use water wave analogy.',
    icon: 'Waves',
    difficulty: 'Intermediate',
    tags: ['WAVES', 'INTERFERENCE'],
    isReady: false
  },
  {
    id: 'light-duality',
    name: 'Light Duality Sim',
    unit: 'Unit 4',
    aos: 'U4A1 MODERN PHYSICS',
    topic: 'WAVE PARTICLE DUALITY OF LIGHT',
    subtopic: 'Light Duality',
    description: 'Explore the evidence for light as both a wave and a particle.',
    theory: '### Wave-Particle Duality\n\nPhotons vs Electromagnetic waves.',
    teacherNotes: 'Discuss the photoelectric effect as evidence for particles.',
    icon: 'Sun',
    difficulty: 'Advanced',
    tags: ['DUALITY', 'PHOTON'],
    isReady: false
  },
  {
    id: 'standing-waves-sim',
    name: 'Standing Waves Sim',
    unit: 'Unit 4',
    aos: 'U4A1 MODERN PHYSICS',
    topic: 'WAVE PARTICLE DUALITY OF LIGHT',
    subtopic: 'Standing Waves',
    description: 'Harmonics in strings and pipes.',
    theory: '### Harmonics\n\nNodes and antinodes.',
    teacherNotes: 'Calculate wavelengths for different modes.',
    icon: 'Activity',
    difficulty: 'Intermediate',
    tags: ['WAVES', 'RESONANCE'],
    isReady: false
  },
  {
    id: 'superposition-sim',
    name: 'Superposition Sim',
    unit: 'Unit 4',
    aos: 'U4A1 MODERN PHYSICS',
    topic: 'WAVE PARTICLE DUALITY OF LIGHT',
    subtopic: 'Superposition',
    description: 'Interactive wave addition.',
    theory: '### Superposition Principle\n\nAdding displacements.',
    teacherNotes: 'Show pulse reflection.',
    icon: 'Plus',
    difficulty: 'Fundamental',
    tags: ['WAVES', 'SUPERPOSITION'],
    isReady: false
  },
  {
    id: 'matter-duality',
    name: 'Matter Duality Sim',
    unit: 'Unit 4',
    aos: 'U4A1 MODERN PHYSICS',
    topic: 'WAVE PARTICLE DUALITY OF MATTER',
    subtopic: 'Matter Duality',
    description: 'De Broglie wavelength and electron diffraction.',
    theory: '### De Broglie Wavelength\n\n$\lambda = h/p$.',
    teacherNotes: 'Evidence for matter waves.',
    icon: 'Atom',
    difficulty: 'Advanced',
    tags: ['MATTER WAVES', 'DE BROGLIE'],
    isReady: false
  }
];
