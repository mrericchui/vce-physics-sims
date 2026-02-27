
export enum AreaOfStudy {
  U3A1 = "U3A1: Motion",
  U3A2 = "U3A2: Fields",
  U3A3 = "U3A3: Electricity",
  U4A1 = "U4A1: Light & Matter",
  U4A2 = "U4A2: Special Relativity",
}

export interface PhysicsSim {
  id: number;
  title: string;
  aos: AreaOfStudy;
  subtopic: string;
  link: string;
  description: string;
  difficulty: 'Foundation' | 'Standard' | 'Advanced';
  tags: string[];
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}
