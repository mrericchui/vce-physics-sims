import { PhysicsSim, AreaOfStudy } from './types';

export const PHYSICS_SIMS: PhysicsSim[] = [
    // U3A1: Motion
    { 
        id: 1, 
        title: "Newton's First Law", 
        aos: AreaOfStudy.U3A1, 
        subtopic: "Newton's laws", 
        link: "#", 
        description: "Explore inertia and balanced forces in a friction-less environment.",
        difficulty: 'Foundation',
        tags: ['Inertia', 'Forces', 'Equilibrium']
    },
    { 
        id: 2, 
        title: "Forces on Incline", 
        aos: AreaOfStudy.U3A1, 
        subtopic: "Newton's laws", 
        link: "#", 
        description: "Calculate normal forces and friction on various slope angles.",
        difficulty: 'Standard',
        tags: ['Friction', 'Vectors', 'Components']
    },
    { 
        id: 3, 
        title: "Circular Acceleration", 
        aos: AreaOfStudy.U3A1, 
        subtopic: "Circular motion", 
        link: "#", 
        description: "Visualise centripetal force and velocity vectors in uniform circular motion.",
        difficulty: 'Standard',
        tags: ['Centripetal', 'Velocity', 'Acceleration']
    },
    { 
        id: 5, 
        title: "Vertical Launch Lab", 
        aos: AreaOfStudy.U3A1, 
        subtopic: "Vertical projectile motion", 
        link: "sims/u3a1/projectile-motion/index.html", 
        description: "Explore 1D motion: Analyse time of flight, peak height, and why velocity is zero at the maximum displacement.",
        difficulty: 'Standard',
        tags: ['Freefall', 'Gravity', 'Linear Kinematics', 'Symmetry']
    },
    { 
        id: 7, 
        title: "Collisions (1D)", 
        aos: AreaOfStudy.U3A1, 
        subtopic: "Momentum", 
        link: "#", 
        description: "Study elastic and inelastic collisions between two carts.",
        difficulty: 'Standard',
        tags: ['Momentum', 'Impulse', 'Conservation']
    },
    // U3A2: Fields
    { 
        id: 11, 
        title: "Planetary Orbits", 
        aos: AreaOfStudy.U3A2, 
        subtopic: "Gravitational", 
        link: "#", 
        description: "Simulate Kepler's Laws and satellite motion around celestial bodies.",
        difficulty: 'Advanced',
        tags: ['Kepler', 'G-Field', 'Orbits']
    },
    { 
        id: 13, 
        title: "Point Charges", 
        aos: AreaOfStudy.U3A2, 
        subtopic: "Electric", 
        link: "#", 
        description: "Map field lines and equipotential surfaces around point charges.",
        difficulty: 'Standard',
        tags: ['Coulomb', 'Electric Field', 'Potential']
    },
    { 
        id: 15, 
        title: "Magnetic Flux Lab", 
        aos: AreaOfStudy.U3A2, 
        subtopic: "Magnetic fields", 
        link: "#", 
        description: "Experiment with Lenz's Law and Faraday's Law through induction.",
        difficulty: 'Advanced',
        tags: ['Induction', 'Lenz', 'Faraday']
    },
    // U4A1: Light & Matter
    { 
        id: 19, 
        title: "Young's Double Slit", 
        aos: AreaOfStudy.U4A1, 
        subtopic: "Wave-particle (Light)", 
        link: "#", 
        description: "Observe interference patterns and measure the wavelength of light.",
        difficulty: 'Advanced',
        tags: ['Interference', 'Diffraction', 'Waves']
    },
    { 
        id: 20, 
        title: "Photoelectric Effect", 
        aos: AreaOfStudy.U4A1, 
        subtopic: "Wave-particle (Light)", 
        link: "#", 
        description: "Determine Planck's constant using the photoelectric threshold.",
        difficulty: 'Advanced',
        tags: ['Photons', 'Work Function', 'Quanta']
    },
    { 
        id: 23, 
        title: "Time Dilation Visual", 
        aos: AreaOfStudy.U4A2, 
        subtopic: "Special relativity", 
        link: "#", 
        description: "Understand time dilation and length contraction at relativistic speeds.",
        difficulty: 'Advanced',
        tags: ['Lorentz', 'Relativity', 'Time']
    }
];

export const VCAA_RESOURCES = [
    { title: "Physics Formula Sheet", url: "https://www.vcaa.vic.edu.au/Documents/exams/physics/physics-formula-sheet.pdf" },
    { title: "Study Design 2024-2027", url: "https://www.vcaa.vic.edu.au/curriculum/vce/vce-study-designs/physics/Pages/Index.aspx" },
    { title: "Past Examinations", url: "https://www.vcaa.vic.edu.au/assessment/vce-assessment/past-examinations/Pages/Physics.aspx" }
];