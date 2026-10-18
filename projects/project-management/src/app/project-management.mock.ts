import type { Project, Skill, TeamMember } from './project-management.model';

/** Static data until the API is wired. Years are relative so the screens always show a current year. */
export const CURRENT_YEAR = new Date().getFullYear();

export const SKILLS: Skill[] = [
  { id: 1, name: 'Angular' },
  { id: 2, name: 'TypeScript' },
  { id: 3, name: 'SQL' },
  { id: 4, name: 'Java' },
  { id: 5, name: 'Python' },
  { id: 6, name: 'React' },
  { id: 7, name: 'Docker' },
  { id: 8, name: 'AWS' },
];

/** Levels are copied from the skills matrix mock and tuned so the readiness numbers match the designs. */
export const TEAM: TeamMember[] = [
  { id: 1, name: 'Arjun Mehta', title: 'Senior Software Engineer', levels: { 1: 'INTERMEDIATE', 2: 'EXPERT', 3: 'EXPERT', 4: 'EXPERT', 5: 'BEGINNER', 7: 'INTERMEDIATE', 8: 'INTERMEDIATE' } },
  { id: 2, name: 'Kavya Reddy', title: 'Software Engineer', levels: { 2: 'INTERMEDIATE', 3: 'INTERMEDIATE', 4: 'BEGINNER', 5: 'EXPERT', 6: 'BEGINNER', 7: 'BEGINNER' } },
  { id: 3, name: 'Rahul Iyer', title: 'Frontend Engineer', levels: { 1: 'EXPERT', 2: 'EXPERT', 3: 'BEGINNER', 6: 'EXPERT', 8: 'BEGINNER' } },
  { id: 4, name: 'Sneha Kulkarni', title: 'QA Engineer', levels: { 1: 'BEGINNER', 2: 'BEGINNER', 3: 'INTERMEDIATE', 4: 'BEGINNER', 5: 'INTERMEDIATE' } },
  { id: 5, name: 'Daniel Thomas', title: 'Backend Engineer', levels: { 2: 'BEGINNER', 3: 'INTERMEDIATE', 4: 'INTERMEDIATE', 5: 'INTERMEDIATE', 7: 'EXPERT', 8: 'INTERMEDIATE' } },
  { id: 6, name: 'Meera Pillai', title: 'Product Designer', levels: { 6: 'BEGINNER' } },
];

const y = CURRENT_YEAR;

export const PROJECTS: Project[] = [
  {
    id: 1,
    name: 'Payments Checkout Revamp',
    description: 'Rebuild the checkout flow in Angular with a new payment-method picker.',
    createdYear: y,
    years: [
      {
        year: y,
        requirements: [
          { id: 1, skillId: 1, minLevel: 'EXPERT', peopleRequired: 1 },
          { id: 2, skillId: 2, minLevel: 'INTERMEDIATE', peopleRequired: 2 },
          { id: 3, skillId: 3, minLevel: 'INTERMEDIATE', peopleRequired: 1 },
        ],
        assignedIds: [3, 1],
      },
    ],
  },
  {
    id: 2,
    name: 'Refunds Service v2',
    description: 'Split refunds out of the monolith into its own Java service on AWS.',
    createdYear: y,
    years: [
      {
        year: y,
        requirements: [
          { id: 4, skillId: 4, minLevel: 'INTERMEDIATE', peopleRequired: 2 },
          { id: 5, skillId: 3, minLevel: 'EXPERT', peopleRequired: 1 },
          { id: 6, skillId: 7, minLevel: 'INTERMEDIATE', peopleRequired: 1 },
          { id: 7, skillId: 8, minLevel: 'INTERMEDIATE', peopleRequired: 1 },
        ],
        assignedIds: [1, 2],
      },
    ],
  },
  {
    id: 3,
    name: 'Merchant Analytics Dashboard',
    description: 'Self-serve sales and settlement reports for merchants.',
    createdYear: y,
    years: [
      {
        year: y,
        requirements: [
          { id: 8, skillId: 6, minLevel: 'INTERMEDIATE', peopleRequired: 2 },
          { id: 9, skillId: 5, minLevel: 'INTERMEDIATE', peopleRequired: 1 },
          { id: 10, skillId: 3, minLevel: 'INTERMEDIATE', peopleRequired: 2 },
        ],
        assignedIds: [2, 6],
      },
    ],
  },
  {
    id: 4,
    name: 'Legacy Billing Migration',
    description: 'Move invoicing off the old billing system.',
    createdYear: y - 1,
    years: [
      {
        year: y - 1,
        requirements: [{ id: 11, skillId: 4, minLevel: 'INTERMEDIATE', peopleRequired: 1 }],
        assignedIds: [5],
      },
    ],
  },
];
