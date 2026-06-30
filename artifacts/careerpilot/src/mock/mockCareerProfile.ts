export const mockCareerProfile = {
  name: 'Adhi Sharma',
  title: 'Senior Software Engineer',
  about: 'Passionate software engineer with 8+ years of experience building scalable web applications. Strong focus on UI/UX, performance, and accessibility. Expert in React ecosystem and modern frontend architecture.',
  skills: {
    'Frontend': ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Redux', 'Zustand', 'GraphQL', 'Framer Motion'],
    'Backend': ['Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'Redis', 'REST APIs'],
    'ML/AI': ['TensorFlow', 'PyTorch', 'OpenAI API', 'LangChain', 'Hugging Face'],
    'DevOps': ['Docker', 'AWS', 'Vercel', 'GitHub Actions', 'CI/CD'],
    'Tools': ['Git', 'Webpack', 'Vite', 'Jest', 'Cypress', 'Playwright'],
    'Databases': ['PostgreSQL', 'MongoDB', 'Redis', 'Supabase']
  },
  projects: [
    { id: '1', name: 'CareerPilot AI', role: 'Lead Developer', description: 'Personal Career Operating System powered by AI.', tech: ['React', 'TypeScript', 'Tailwind', 'OpenAI'], link: 'github.com/adhi/careerpilot' },
    { id: '2', name: 'E-commerce Platform', role: 'Senior Frontend Engineer', description: 'High-performance e-commerce frontend serving 1M+ MAU.', tech: ['Next.js', 'GraphQL', 'Stripe'], link: 'github.com/adhi/ecommerce' }
  ],
  experience: [
    { id: '1', company: 'TechCorp', role: 'Senior Software Engineer', period: '2021 - Present', description: 'Led frontend team of 5 engineers. Migrated legacy SPA to Next.js.' },
    { id: '2', company: 'StartupInc', role: 'Software Engineer', period: '2018 - 2021', description: 'Developed core product features using React and Node.js.' }
  ],
  education: [
    { id: '1', institution: 'University of Technology', degree: 'B.S. Computer Science', year: '2018' }
  ],
  certifications: [
    { id: '1', name: 'AWS Certified Solutions Architect', issuer: 'AWS', year: '2022' }
  ]
};
