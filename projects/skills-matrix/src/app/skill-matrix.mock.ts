import type { MatrixEmployee, MatrixSkill } from './skill-matrix.model';

// Static data until the API is wired: 6 direct reports across 8 skills.
export const SKILLS: MatrixSkill[] = [
  { id: 1, name: 'Angular' },
  { id: 2, name: 'TypeScript' },
  { id: 3, name: 'SQL' },
  { id: 4, name: 'Java' },
  { id: 5, name: 'Python' },
  { id: 6, name: 'React' },
  { id: 7, name: 'Docker' },
  { id: 8, name: 'AWS' },
];

export const MATRIX_EMPLOYEES: MatrixEmployee[] = [
  {
    id: 1,
    name: 'Arjun Mehta',
    title: 'Senior Software Engineer',
    levels: { 1: 'INTERMEDIATE', 2: 'EXPERT', 3: 'BEGINNER', 4: 'EXPERT', 5: 'BEGINNER', 7: 'INTERMEDIATE', 8: 'INTERMEDIATE' },
  },
  {
    id: 2,
    name: 'Kavya Reddy',
    title: 'Software Engineer',
    levels: { 2: 'INTERMEDIATE', 3: 'INTERMEDIATE', 4: 'BEGINNER', 5: 'EXPERT', 6: 'BEGINNER', 7: 'BEGINNER' },
  },
  {
    id: 3,
    name: 'Rahul Iyer',
    title: 'Frontend Engineer',
    levels: { 1: 'EXPERT', 2: 'EXPERT', 3: 'BEGINNER', 6: 'EXPERT', 8: 'BEGINNER' },
  },
  {
    id: 4,
    name: 'Sneha Kulkarni',
    title: 'QA Engineer',
    levels: { 1: 'BEGINNER', 2: 'BEGINNER', 3: 'INTERMEDIATE', 4: 'BEGINNER', 5: 'INTERMEDIATE' },
  },
  {
    id: 5,
    name: 'Daniel Thomas',
    title: 'Backend Engineer',
    levels: { 2: 'BEGINNER', 3: 'INTERMEDIATE', 4: 'INTERMEDIATE', 5: 'INTERMEDIATE', 7: 'EXPERT', 8: 'INTERMEDIATE' },
  },
  {
    id: 6,
    name: 'Meera Pillai',
    title: 'Product Designer',
    levels: { 6: 'BEGINNER' },
  },
];
