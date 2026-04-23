import dotenv from 'dotenv';
import connectDB from '../config/database.js';
import Career from '../models/Career.js';

dotenv.config();

const careerData = [
  {
    title: 'Software Engineer',
    description:
      'Develop and maintain software applications. Work with various programming languages and frameworks to build scalable solutions.',
    short_description: 'Build and maintain software applications',
    domain: 'Technology',
    trait_requirements: {
      openness: 80,
      conscientiousness: 85,
      extraversion: 40,
      agreeableness: 60,
      neuroticism: 20,
    },
    salary: {
      entry_level: 70000,
      mid_career: 110000,
      experienced: 150000,
    },
    job_outlook: {
      growth_rate: 15,
      demand_level: 'very_high',
      available_jobs: 500000,
    },
    skills: [
      { name: 'Programming', importance: 'critical' },
      { name: 'Problem Solving', importance: 'critical' },
      { name: 'System Design', importance: 'important' },
      { name: 'Communication', importance: 'important' },
    ],
    education: {
      minimum_level: 'bachelor',
      common_fields: ['Computer Science', 'Software Engineering', 'Mathematics'],
      certifications: ['AWS', 'Google Cloud', 'Azure'],
    },
    work_environment: {
      work_type: ['remote', 'hybrid', 'on-site'],
      environment: ['office'],
      travel_required: false,
      physical_demands: 'Minimal',
    },
    career_path: {
      entry_positions: ['Junior Developer', 'Software Engineer'],
      growth_positions: ['Senior Developer', 'Tech Lead'],
      top_positions: ['Engineering Manager', 'Architect'],
    },
    common_industries: ['Technology', 'Finance', 'Healthcare', 'E-commerce'],
    top_companies: ['Google', 'Microsoft', 'Apple', 'Facebook', 'Amazon'],
    learning_paths: ['Online Bootcamps', 'University Programs', 'Self-study'],
    typical_day: 'Write code, attend meetings, review pull requests, debug issues',
    pros: [
      'High salary',
      'Remote opportunities',
      'Job security',
      'Continuous learning',
      'Creative problem-solving',
    ],
    cons: ['High stress', 'Long hours during crunch', 'Rapidly changing tech'],
    is_active: true,
    is_featured: true,
    rating: 4.5,
  },
  {
    title: 'Data Scientist',
    description:
      'Analyze complex datasets to help companies make data-driven decisions. Use machine learning and statistical methods.',
    short_description: 'Extract insights from data using analytics and ML',
    domain: 'Technology',
    trait_requirements: {
      openness: 85,
      conscientiousness: 80,
      extraversion: 50,
      agreeableness: 65,
      neuroticism: 25,
    },
    salary: {
      entry_level: 75000,
      mid_career: 120000,
      experienced: 160000,
    },
    job_outlook: {
      growth_rate: 36,
      demand_level: 'very_high',
      available_jobs: 400000,
    },
    skills: [
      { name: 'Python/R', importance: 'critical' },
      { name: 'Machine Learning', importance: 'critical' },
      { name: 'Statistics', importance: 'critical' },
      { name: 'SQL', importance: 'important' },
    ],
    education: {
      minimum_level: 'master',
      common_fields: ['Data Science', 'Statistics', 'Computer Science', 'Mathematics'],
      certifications: ['Google Data Analytics', 'AWS ML', 'IBM Data Science'],
    },
    work_environment: {
      work_type: ['remote', 'hybrid'],
      environment: ['office'],
      travel_required: false,
    },
    career_path: {
      entry_positions: ['Junior Data Scientist', 'Data Analyst'],
      growth_positions: ['Senior Data Scientist'],
      top_positions: ['ML Engineer', 'AI Research Lead'],
    },
    common_industries: ['Technology', 'Finance', 'Healthcare', 'E-commerce', 'Marketing'],
    top_companies: ['Google', 'Meta', 'LinkedIn', 'Netflix', 'Uber'],
    learning_paths: ['Master Programs', 'Bootcamps', 'Online Courses'],
    typical_day: 'Analyze data, build models, visualize insights, present findings',
    pros: [
      'High salary',
      'Intellectual challenge',
      'Growing field',
      'Impact on business decisions',
    ],
    cons: [
      'High technical requirement',
      'Data quality issues',
      'Complex problem solving',
    ],
    is_active: true,
    is_featured: true,
    rating: 4.6,
  },
  {
    title: 'Nurse',
    description:
      'Provide patient care in hospitals and clinics. Monitor vital signs, administer medications, and support physicians.',
    short_description: 'Provide compassionate patient care in healthcare settings',
    domain: 'Healthcare',
    trait_requirements: {
      openness: 70,
      conscientiousness: 90,
      extraversion: 75,
      agreeableness: 90,
      neuroticism: 15,
    },
    salary: {
      entry_level: 55000,
      mid_career: 75000,
      experienced: 95000,
    },
    job_outlook: {
      growth_rate: 15,
      demand_level: 'very_high',
      available_jobs: 300000,
    },
    skills: [
      { name: 'Patient Care', importance: 'critical' },
      { name: 'Communication', importance: 'critical' },
      { name: 'Medical Knowledge', importance: 'critical' },
      { name: 'Empathy', importance: 'important' },
    ],
    education: {
      minimum_level: 'bachelor',
      common_fields: ['Nursing', 'Healthcare'],
      certifications: ['RN License', 'BSN', 'Specialized Certifications'],
    },
    work_environment: {
      work_type: ['on-site'],
      environment: ['hospital', 'clinic', 'patient homes'],
      travel_required: false,
      physical_demands: 'High - standing, lifting, physical activity',
    },
    career_path: {
      entry_positions: ['Registered Nurse', 'Licensed Practical Nurse'],
      growth_positions: ['Charge Nurse', 'Nurse Manager'],
      top_positions: ['Nursing Director', 'Chief Nursing Officer'],
    },
    common_industries: ['Healthcare', 'Hospitals', 'Clinics', 'Home Health'],
    top_companies: ['Mayo Clinic', 'Cleveland Clinic', 'Johns Hopkins', 'Mass General'],
    learning_paths: ['Bachelor Programs', 'Associate Degree Programs'],
    typical_day:
      'Monitor patients, administer care, work with medical team, document records',
    pros: [
      'Helping people',
      'Job security',
      'Good benefits',
      'Flexible schedules',
      'Sense of purpose',
    ],
    cons: ['Long shifts', 'Physical demands', 'Emotional stress', 'High responsibility'],
    is_active: true,
    is_featured: true,
    rating: 4.3,
  },
  {
    title: 'Product Manager',
    description:
      'Lead product strategy and development. Coordinate between teams to deliver products that meet user needs.',
    short_description: 'Lead product strategy and cross-functional teams',
    domain: 'Business & Finance',
    trait_requirements: {
      openness: 80,
      conscientiousness: 85,
      extraversion: 85,
      agreeableness: 70,
      neuroticism: 20,
    },
    salary: {
      entry_level: 85000,
      mid_career: 140000,
      experienced: 180000,
    },
    job_outlook: {
      growth_rate: 8,
      demand_level: 'high',
      available_jobs: 200000,
    },
    skills: [
      { name: 'Strategic Thinking', importance: 'critical' },
      { name: 'Leadership', importance: 'critical' },
      { name: 'Communication', importance: 'critical' },
      { name: 'Analytical Skills', importance: 'important' },
    ],
    education: {
      minimum_level: 'bachelor',
      common_fields: ['Business', 'Engineering', 'Technology', 'Any field'],
      certifications: ['MBA', 'Product Management Courses'],
    },
    work_environment: {
      work_type: ['hybrid', 'on-site'],
      environment: ['office'],
      travel_required: true,
    },
    career_path: {
      entry_positions: ['Associate Product Manager', 'Junior PM'],
      growth_positions: ['Senior Product Manager', 'Group PM'],
      top_positions: ['Director of Product', 'VP Product'],
    },
    common_industries: [
      'Technology',
      'Finance',
      'E-commerce',
      'Healthcare',
      'Any Industry',
    ],
    top_companies: ['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple'],
    learning_paths: ['MBA Programs', 'PM Bootcamps', 'On-the-job training'],
    typical_day:
      'Strategy meetings, user research, prioritization, cross-team collaboration',
    pros: [
      'High impact',
      'Leadership opportunity',
      'Good salary',
      'Creative problem-solving',
    ],
    cons: ['High pressure', 'Unclear responsibilities', 'Long hours', 'Difficult decisions'],
    is_active: true,
    is_featured: true,
    rating: 4.4,
  },
  {
    title: 'UX/UI Designer',
    description:
      'Design user interfaces and experiences for digital products. Create wireframes, prototypes, and visual designs.',
    short_description: 'Create beautiful and functional user interfaces',
    domain: 'Creative Arts',
    trait_requirements: {
      openness: 90,
      conscientiousness: 75,
      extraversion: 70,
      agreeableness: 75,
      neuroticism: 30,
    },
    salary: {
      entry_level: 60000,
      mid_career: 95000,
      experienced: 130000,
    },
    job_outlook: {
      growth_rate: 13,
      demand_level: 'very_high',
      available_jobs: 250000,
    },
    skills: [
      { name: 'Design Tools', importance: 'critical' },
      { name: 'Creativity', importance: 'critical' },
      { name: 'User Research', importance: 'important' },
      { name: 'Prototyping', importance: 'important' },
    ],
    education: {
      minimum_level: 'bachelor',
      common_fields: ['Design', 'Fine Arts', 'Computer Science', 'HCI'],
      certifications: ['UX Certification', 'Design Tools Courses'],
    },
    work_environment: {
      work_type: ['remote', 'hybrid', 'on-site'],
      environment: ['office'],
      travel_required: false,
    },
    career_path: {
      entry_positions: ['Junior Designer', 'UI Designer'],
      growth_positions: ['Senior Designer', 'Design Lead'],
      top_positions: ['Design Director', 'Head of Design'],
    },
    common_industries: ['Technology', 'E-commerce', 'Media', 'Finance', 'Healthcare'],
    top_companies: ['Apple', 'Google', 'Meta', 'Airbnb', 'Figma'],
    learning_paths: ['Design Bootcamps', 'Bachelor Programs', 'Online Courses'],
    typical_day:
      'Wireframing, prototyping, user testing, design iterations, collaboration',
    pros: [
      'Creative freedom',
      'Visual impact',
      'Diverse projects',
      'Remote opportunities',
    ],
    cons: ['Subjective feedback', 'Revision cycles', 'Trend pressure', 'Imposter syndrome'],
    is_active: true,
    is_featured: true,
    rating: 4.5,
  },
  {
    title: 'Teacher',
    description:
      'Educate students in various subjects. Develop curriculum, teach classes, grade assignments, and support student growth.',
    short_description: 'Educate and inspire the next generation',
    domain: 'Education',
    trait_requirements: {
      openness: 80,
      conscientiousness: 85,
      extraversion: 85,
      agreeableness: 85,
      neuroticism: 25,
    },
    salary: {
      entry_level: 40000,
      mid_career: 55000,
      experienced: 70000,
    },
    job_outlook: {
      growth_rate: 4,
      demand_level: 'high',
      available_jobs: 150000,
    },
    skills: [
      { name: 'Teaching', importance: 'critical' },
      { name: 'Communication', importance: 'critical' },
      { name: 'Patience', importance: 'critical' },
      { name: 'Subject Knowledge', importance: 'critical' },
    ],
    education: {
      minimum_level: 'bachelor',
      common_fields: ['Education', 'Subject Area', 'Pedagogy'],
      certifications: ['Teaching License', 'Advanced Degrees'],
    },
    work_environment: {
      work_type: ['on-site'],
      environment: ['classroom'],
      travel_required: false,
      physical_demands: 'Moderate - standing, speaking',
    },
    career_path: {
      entry_positions: ['Teacher', 'Substitute Teacher'],
      growth_positions: ['Department Head', 'Curriculum Specialist'],
      top_positions: ['Principal', 'Superintendent'],
    },
    common_industries: ['Education', 'Public Schools', 'Private Schools', 'Universities'],
    top_companies: ['School Districts', 'Private Schools', 'Universities'],
    learning_paths: ['Bachelor Programs', 'Master Programs', 'Teaching Certifications'],
    typical_day: 'Teach classes, grade assignments, prepare lessons, meet with students',
    pros: [
      'Impact on students',
      'Job security',
      'Summer breaks',
      'Sense of purpose',
      'Pensions',
    ],
    cons: [
      'Lower salary',
      'Student behavior issues',
      'Administrative burden',
      'Emotional labor',
    ],
    is_active: true,
    is_featured: false,
    rating: 4.0,
  },
  {
    title: 'Electrical Engineer',
    description:
      'Design and develop electrical systems and equipment. Work on power systems, electronics, and automation.',
    short_description: 'Design electrical systems and power solutions',
    domain: 'Engineering',
    trait_requirements: {
      openness: 75,
      conscientiousness: 90,
      extraversion: 50,
      agreeableness: 60,
      neuroticism: 15,
    },
    salary: {
      entry_level: 65000,
      mid_career: 100000,
      experienced: 130000,
    },
    job_outlook: {
      growth_rate: 7,
      demand_level: 'high',
      available_jobs: 200000,
    },
    skills: [
      { name: 'Circuit Design', importance: 'critical' },
      { name: 'Problem Solving', importance: 'critical' },
      { name: 'CAD', importance: 'important' },
      { name: 'Mathematics', importance: 'critical' },
    ],
    education: {
      minimum_level: 'bachelor',
      common_fields: ['Electrical Engineering', 'Electronics'],
      certifications: ['PE License', 'Specialized Certifications'],
    },
    work_environment: {
      work_type: ['on-site', 'hybrid'],
      environment: ['office', 'laboratory', 'field'],
      travel_required: true,
    },
    career_path: {
      entry_positions: ['Junior Engineer', 'Design Engineer'],
      growth_positions: ['Senior Engineer', 'Engineering Manager'],
      top_positions: ['Director', 'Chief Engineer'],
    },
    common_industries: ['Power Generation', 'Telecommunications', 'Manufacturing', 'Aerospace'],
    top_companies: ['Tesla', 'GE', 'Siemens', 'ABB', 'Eaton'],
    learning_paths: ['Bachelor Programs', 'Master Programs'],
    typical_day: 'Design circuits, test systems, collaborate with teams, documentation',
    pros: [
      'Good salary',
      'Job security',
      'Technical challenge',
      'Diverse applications',
    ],
    cons: [
      'Complex mathematics',
      'Licensing requirements',
      'Long development cycles',
    ],
    is_active: true,
    is_featured: false,
    rating: 4.2,
  },
  {
    title: 'Lawyer',
    description:
      'Provide legal advice and representation. Research laws, draft documents, and advocate for clients in court.',
    short_description: 'Provide legal expertise and representation',
    domain: 'Law & Government',
    trait_requirements: {
      openness: 75,
      conscientiousness: 95,
      extraversion: 80,
      agreeableness: 65,
      neuroticism: 20,
    },
    salary: {
      entry_level: 60000,
      mid_career: 110000,
      experienced: 200000,
    },
    job_outlook: {
      growth_rate: 3,
      demand_level: 'moderate',
      available_jobs: 150000,
    },
    skills: [
      { name: 'Legal Knowledge', importance: 'critical' },
      { name: 'Research', importance: 'critical' },
      { name: 'Argumentation', importance: 'critical' },
      { name: 'Writing', importance: 'critical' },
    ],
    education: {
      minimum_level: 'master',
      common_fields: ['Law', 'Legal Studies'],
      certifications: ['Bar License', 'Specialization Licenses'],
    },
    work_environment: {
      work_type: ['on-site', 'hybrid'],
      environment: ['office', 'courtroom'],
      travel_required: true,
    },
    career_path: {
      entry_positions: ['Associate', 'Junior Lawyer'],
      growth_positions: ['Senior Associate', 'Counsel'],
      top_positions: ['Partner', 'General Counsel'],
    },
    common_industries: [
      'Law Firms',
      'Corporate',
      'Government',
      'Non-profit',
      'Finance',
    ],
    top_companies: [
      'Kirkland & Ellis',
      'Skadden',
      'Cravath',
      'Goldman Sachs Legal',
      'Microsoft Legal',
    ],
    learning_paths: ['Law School', 'Bar Preparation Courses'],
    typical_day: 'Research cases, draft documents, client meetings, court appearances',
    pros: ['High salary', 'Prestige', 'Job security', 'Advocacy opportunity'],
    cons: [
      'High stress',
      'Long hours',
      'Difficult clients',
      'Emotional toll',
      'Expensive education',
    ],
    is_active: true,
    is_featured: false,
    rating: 3.8,
  },
  {
    title: 'Research Scientist',
    description:
      'Conduct scientific research to advance knowledge. Design experiments, analyze data, and publish findings.',
    short_description: 'Advance science through research and experimentation',
    domain: 'Science & Research',
    trait_requirements: {
      openness: 95,
      conscientiousness: 90,
      extraversion: 40,
      agreeableness: 70,
      neuroticism: 25,
    },
    salary: {
      entry_level: 55000,
      mid_career: 85000,
      experienced: 120000,
    },
    job_outlook: {
      growth_rate: 10,
      demand_level: 'high',
      available_jobs: 180000,
    },
    skills: [
      { name: 'Scientific Method', importance: 'critical' },
      { name: 'Research Design', importance: 'critical' },
      { name: 'Data Analysis', importance: 'critical' },
      { name: 'Writing', importance: 'important' },
    ],
    education: {
      minimum_level: 'master',
      common_fields: ['Science', 'Research', 'Your Specialty'],
      certifications: ['PhD', 'Postdoc', 'Research Certifications'],
    },
    work_environment: {
      work_type: ['on-site'],
      environment: ['laboratory', 'field', 'office'],
      travel_required: true,
    },
    career_path: {
      entry_positions: ['Junior Researcher', 'Research Associate'],
      growth_positions: ['Senior Researcher', 'Research Lead'],
      top_positions: ['Research Director', 'Principal Investigator'],
    },
    common_industries: ['Universities', 'Research Institutes', 'Government Labs', 'Pharma'],
    top_companies: [
      'MIT',
      'Stanford',
      'NIH',
      'NASA',
      'Max Planck Institute',
    ],
    learning_paths: ['PhD Programs', 'Postdoc Positions', 'Research Training'],
    typical_day: 'Experiments, data analysis, literature review, writing, collaborations',
    pros: [
      'Intellectual challenge',
      'Impact on science',
      'Autonomy',
      'Publication opportunities',
    ],
    cons: [
      'Lower salary',
      'Job insecurity',
      'Funding competition',
      'Long education',
      'Intense pressure',
    ],
    is_active: true,
    is_featured: false,
    rating: 4.1,
  },
];

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seed...');

    // Connect to DB
    await connectDB();

    // Clear existing careers
    await Career.deleteMany({});
    console.log('🗑️  Cleared existing careers');

    // Insert new careers
    const result = await Career.insertMany(careerData);
    console.log(`✅ Successfully seeded ${result.length} careers`);

    console.log(`
╔════════════════════════════════════════╗
║   ✨ DATABASE SEEDED SUCCESSFULLY ✨   ║
╚════════════════════════════════════════╝

Added careers:
${result.map((career) => `  • ${career.title} (${career.domain})`).join('\n')}

Total: ${result.length} careers
    `);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
