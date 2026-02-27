import { LucideIcon } from 'lucide-react';

export type Unit = 'Unit 3' | 'Unit 4';

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
  icon: string; // Lucide icon name
}

export interface AreaOfStudy {
  id: string;
  unit: Unit;
  title: string;
  description: string;
}

export const AREAS_OF_STUDY: AreaOfStudy[] = [
  // Unit 3
  {
    id: 'u3-aos1',
    unit: 'Unit 3',
    title: 'Fields: How do things move without contact?',
    description: 'Gravitational, electric and magnetic fields.'
  },
  {
    id: 'u3-aos2',
    unit: 'Unit 3',
    title: 'Electrical Energy: How are fields used to move electrical energy?',
    description: 'Generation and transmission of electricity.'
  },
  {
    id: 'u3-aos3',
    unit: 'Unit 3',
    title: 'Motion: How fast can things go?',
    description: 'Newtonian mechanics, circular motion, and special relativity.'
  },
  // Unit 4
  {
    id: 'u4-aos1',
    unit: 'Unit 4',
    title: 'Waves: How can waves explain the world?',
    description: 'Mechanical waves and light as a wave.'
  },
  {
    id: 'u4-aos2',
    unit: 'Unit 4',
    title: 'Light and Matter: How are light and matter similar?',
    description: 'Wave-particle duality and energy levels.'
  }
];

export const SIMULATIONS: Simulation[] = [
  {
    id: 'grav-field-lines',
    name: 'Gravitational Field Visualiser',
    unit: 'Unit 3',
    aos: 'AOS 1: Fields',
    topic: 'Gravitational Fields',
    subtopic: 'Field Lines and Potential',
    description: 'Explore how mass affects the curvature of space-time and gravitational field strength.',
    theory: '### Gravitational Fields\n\nA gravitational field is a region in which a mass experiences a force. The strength of the field $g$ is defined as the force per unit mass: $g = F/m$. For a point mass, $g = GM/r^2$.',
    teacherNotes: 'Use this to demonstrate the inverse square law. Ask students to predict the field strength at double the distance.',
    icon: 'Orbit'
  },
  {
    id: 'projectile-motion',
    name: 'Projectile Motion Lab',
    unit: 'Unit 3',
    aos: 'AOS 3: Motion',
    topic: 'Newtonian Mechanics',
    subtopic: 'Projectile Motion',
    description: 'Simulate projectiles with varying launch angles, velocities, and air resistance.',
    theory: '### Projectile Motion\n\nProjectile motion can be analysed by separating it into horizontal and vertical components. Horizontal velocity remains constant (neglecting air resistance), while vertical motion is subject to constant acceleration due to gravity.',
    teacherNotes: 'Great for verifying the 45-degree maximum range theory. Have students calculate the time of flight manually first.',
    icon: 'Zap'
  },
  {
    id: 'photoelectric-effect',
    name: 'Photoelectric Effect',
    unit: 'Unit 4',
    aos: 'AOS 2: Light and Matter',
    topic: 'Wave-Particle Duality',
    subtopic: 'The Photoelectric Effect',
    description: 'Observe how light frequency and intensity affect electron emission from metal surfaces.',
    theory: '### The Photoelectric Effect\n\nEinstein proposed that light consists of discrete packets of energy called photons. The energy of a photon is $E = hf$. If this energy exceeds the work function $\\phi$ of the metal, electrons are emitted.',
    teacherNotes: 'Focus on the threshold frequency. Students often confuse intensity with frequency; use the simulation to clarify that intensity only affects the current, not the stopping voltage.',
    icon: 'Sun'
  }
];
