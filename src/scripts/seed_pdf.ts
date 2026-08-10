import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import { PdfService } from '../app/modules/ai/services/pdf.service.js';
import { KnowledgeService } from '../app/modules/ai/services/knowledge.service.js';
import { prisma } from '../app/shared/prisma.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateAndSeed() {
  console.log('Generating Sohag Ali Profile PDF...');

  const pdfPath = path.join(__dirname, 'sohag_profile.pdf');
  const doc = new PDFDocument({ margin: 40 });

  const writeStream = fs.createWriteStream(pdfPath);
  doc.pipe(writeStream);

  // PDF Header
  doc.font('Helvetica-Bold').fontSize(24).text('Sohag Ali', { align: 'center' });
  doc.font('Helvetica').fontSize(14).text('Full Stack Web Developer', { align: 'center' });
  doc.fontSize(10).text(
    'Phone/WhatsApp: +8801302243428 | Email: sohagahmed056@gmail.com',
    { align: 'center' }
  );
  doc.fontSize(10).text(
    'LinkedIn: linkedin.com/in/sohagalidev | GitHub: github.com/Sohag-Ahmed056',
    { align: 'center' }
  );
  doc.moveDown(1.5);

  // Technical Skills
  doc.font('Helvetica-Bold').fontSize(16).text('Skills', { underline: true });
  doc.font('Helvetica-Bold').fontSize(11).text('Frontend: ', { continued: true }).font('Helvetica').text('React, Next.js, TypeScript, JavaScript, HTML, CSS, Tailwind CSS');
  doc.font('Helvetica-Bold').fontSize(11).text('Backend: ', { continued: true }).font('Helvetica').text('Node.js, Express, MongoDB, Prisma, REST API, PostgreSQL');
  doc.font('Helvetica-Bold').fontSize(11).text('Tools: ', { continued: true }).font('Helvetica').text('Git, GitHub, Docker, Postman, VS Code');
  doc.font('Helvetica-Bold').fontSize(11).text('Soft Skills: ', { continued: true }).font('Helvetica').text('Problem Solving, Teamwork, Communication, Time Management');
  doc.moveDown();

  // Work Experience
  doc.font('Helvetica-Bold').fontSize(16).text('Work Experience', { underline: true });
  doc.font('Helvetica-Bold').fontSize(12).text('NirmanIT — Backend Engineer (Remote)');
  doc.font('Helvetica').fontSize(10).text('Oct 2025 – Present | Dhaka, Bangladesh');
  doc.font('Helvetica').fontSize(10).text('• Contributed to multiple production projects including HelpUp, HotelCity, and a POS application.');
  doc.font('Helvetica').fontSize(10).text('• Designed and developed RESTful APIs using Node.js and Express.js to support core business features.');
  doc.font('Helvetica').fontSize(10).text('• Built backend services for HotelCity (hotel listings, bookings, user management) and POS (order processing, inventory, transactions).');
  doc.font('Helvetica').fontSize(10).text('• Collaborated with cross-functional teams to deliver reliable, scalable backend solutions on schedule.');
  doc.moveDown();

  // Projects
  doc.font('Helvetica-Bold').fontSize(16).text('Projects', { underline: true });
  
  doc.font('Helvetica-Bold').fontSize(12).text('1. Digital Wallet System');
  doc.font('Helvetica').fontSize(10).text('Technologies: React, TypeScript, Express.js, MongoDB');
  doc.font('Helvetica').fontSize(10).text('• Developed a secure and scalable digital wallet system with user, agent, and admin roles.');
  doc.font('Helvetica').fontSize(10).text('• Implemented JWT-based authentication and role-based route protection.');
  doc.font('Helvetica').fontSize(10).text('• Enabled users to manage wallets, transfer money, and view transaction history.');
  doc.font('Helvetica').fontSize(10).text('• Built agent features for cash-in/cash-out, commissions, and admin approval requests.');
  doc.font('Helvetica').fontSize(10).text('• Provided admin controls to monitor data, manage agents, and block/unblock wallets.');
  doc.font('Helvetica').fontSize(10).text('• Designed RESTful APIs with search, filter, sort, and pagination for efficient data handling.');
  doc.moveDown(0.5);

  doc.font('Helvetica-Bold').fontSize(12).text('2. TourBuddy: Tour Partner Finder');
  doc.font('Helvetica').fontSize(10).text('Technologies: Next.js, TypeScript, Express.js, PostgreSQL');
  doc.font('Helvetica').fontSize(10).text('• Developed a full-stack platform for posting tours, joining others, and receiving AI-powered suggestions based on user preferences.');
  doc.font('Helvetica').fontSize(10).text('• Built RESTful APIs with Express.js and PostgreSQL/Prisma for user profiles, tour posts, and participation records.');
  doc.font('Helvetica').fontSize(10).text('• Integrated AI recommendation engine to analyze user behavior and suggest tailored tour opportunities.');
  doc.font('Helvetica').fontSize(10).text('• Implemented role-based access control (admin/user) and individual chat between travelers.');
  doc.font('Helvetica').fontSize(10).text('• Optimized API endpoints and database queries for high performance under concurrent user load.');
  doc.moveDown();

  // Certifications & Languages
  doc.font('Helvetica-Bold').fontSize(16).text('Certifications', { underline: true });
  doc.font('Helvetica').fontSize(10).text('• Next Level Web Development Bootcamp – Programming Hero');
  doc.moveDown(0.5);

  doc.font('Helvetica-Bold').fontSize(16).text('Languages', { underline: true });
  doc.font('Helvetica').fontSize(10).text('• Bangla (Bengali): Native proficiency');
  doc.font('Helvetica').fontSize(10).text('• English: Professional working proficiency');
  doc.moveDown(0.5);

  // Education
  doc.font('Helvetica-Bold').fontSize(16).text('Education', { underline: true });
  doc.font('Helvetica-Bold').fontSize(12).text('Green University of Bangladesh');
  doc.font('Helvetica').fontSize(10).text('Bachelor of Science in Computer Science and Engineering (CSE) | Expected Graduation: 2026');
  doc.font('Helvetica').fontSize(10).text('Dhaka, Bangladesh');

  doc.end();

  await new Promise<void>((resolve, reject) => {
    writeStream.on('finish', () => resolve());
    writeStream.on('error', reject);
  });

  console.log('PDF generated at:', pdfPath);
  console.log('Seeding knowledge base in database...');

  const rawText = `
Sohag Ali - Full Stack Web Developer Profile & CV

Contact Information:
- Full Name: Sohag Ali (also known as Sohag Ahmed)
- Role: Full Stack Web Developer / Backend Engineer
- Phone / WhatsApp: +8801302243428
- Email: sohagahmed056@gmail.com
- LinkedIn: https://linkedin.com/in/sohagalidev
- GitHub: https://github.com/Sohag-Ahmed056
- Location: Dhaka, Bangladesh

Technical Skills & Expertise:
- Frontend Development: React, Next.js, TypeScript, JavaScript, HTML5, CSS3, Tailwind CSS.
- Backend Development: Node.js, Express.js, MongoDB, Prisma ORM, REST APIs, PostgreSQL.
- Tools & Environment: Git, GitHub, Docker, Postman, VS Code.
- Soft Skills: Problem Solving, Teamwork, Communication, Time Management.

Work Experience:
Company: NirmanIT
Role: Backend Engineer (Remote)
Location: Dhaka, Bangladesh
Duration: October 2025 – Present
Responsibilities & Accomplishments:
- Contributed to multiple production projects including HelpUp, HotelCity, and a POS (Point of Sale) application.
- Designed and developed RESTful APIs using Node.js and Express.js to support core business features.
- Built backend services for HotelCity (hotel listings, bookings, user management) and POS (order processing, inventory, transactions).
- Collaborated with cross-functional teams to deliver reliable, scalable backend solutions on schedule.

Key Portfolio Projects:
1. Digital Wallet System
- Stack: React, TypeScript, Express.js, MongoDB
- GitHub: https://github.com/Sohag-Ahmed056
- Overview: Developed a secure and scalable digital wallet system with user, agent, and admin roles.
- Features: Implemented JWT-based authentication and role-based route protection. Enabled users to manage wallets, transfer money, and view transaction history. Built agent features for cash-in/cash-out, commissions, and admin approval requests. Provided admin controls to monitor data, manage agents, and block/unblock wallets. Designed RESTful APIs with search, filter, sort, and pagination for efficient data handling.

2. TourBuddy: Tour Partner Finder
- Stack: Next.js, TypeScript, Express.js, PostgreSQL
- GitHub: https://github.com/Sohag-Ahmed056
- Overview: Developed a full-stack platform for posting tours, joining others, and receiving AI-powered suggestions based on user preferences.
- Features: Built RESTful APIs with Express.js and PostgreSQL/Prisma for user profiles, tour posts, and participation records. Integrated AI recommendation engine to analyze user behavior and suggest tailored tour opportunities. Implemented role-based access control (admin/user) and individual chat between travelers. Optimized API endpoints and database queries for high performance under concurrent user load.

Certifications:
- Next Level Web Development Bootcamp – Programming Hero

Languages Spoken:
- Bangla (Bengali): Native proficiency
- English: Professional working proficiency

Education:
- Institution: Green University of Bangladesh
- Degree: Bachelor of Science in Computer Science and Engineering (CSE)
- Location: Dhaka, Bangladesh
- Expected Graduation Year: 2026
`;

  try {
    // Clean old chunks for Sohag Profile
    await prisma.knowledge.deleteMany({
      where: {
        title: 'Sohag Profile',
      },
    });

    const chunks = PdfService.chunkText(rawText);
    console.log('Generated Chunks count:', chunks.length);

    const documentId = `doc_${Date.now()}`;
    await KnowledgeService.saveChunks(
      documentId,
      'Sohag Profile',
      'sohag_profile.pdf',
      chunks
    );

    console.log('Successfully seeded Knowledge table!');

    // Seed or update owner user & active Resume record for structured UI responses
    console.log('Seeding owner user and structured Resume & Projects...');
    let user = await prisma.user.findUnique({
      where: { email: 'sohagahmed056@gmail.com' },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: 'sohagahmed056@gmail.com',
          name: 'Sohag Ali',
          password: 'hashed_placeholder_password',
          role: 'OWNER',
        },
      });
    }

    // Upsert active resume
    await prisma.resume.deleteMany({ where: { userId: user.id } });
    await prisma.resume.create({
      data: {
        userId: user.id,
        name: 'Sohag Ali',
        title: 'Full Stack Web Developer',
        email: 'sohagahmed056@gmail.com',
        phone: '+8801302243428',
        github: 'https://github.com/Sohag-Ahmed056',
        skills: [
          'React', 'Next.js', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Tailwind CSS',
          'Node.js', 'Express.js', 'MongoDB', 'Prisma', 'PostgreSQL', 'REST API',
          'Git', 'GitHub', 'Docker', 'Postman', 'VS Code'
        ],
        education: [
          {
            institution: 'Green University of Bangladesh',
            degree: 'Bachelor of Science in Computer Science and Engineering (CSE)',
            expectedGraduation: '2026',
            location: 'Dhaka, Bangladesh'
          }
        ],
        experience: [
          {
            company: 'NirmanIT',
            role: 'Backend Engineer (Remote)',
            period: 'Oct 2025 – Present',
            location: 'Dhaka, Bangladesh',
            details: [
              'Contributed to multiple production projects including HelpUp, HotelCity, and a POS application.',
              'Designed and developed RESTful APIs using Node.js and Express.js to support core business features.',
              'Built backend services for HotelCity (hotel listings, bookings, user management) and POS (order processing, inventory, transactions).',
              'Collaborated with cross-functional teams to deliver reliable, scalable backend solutions on schedule.'
            ]
          }
        ],
        projects: [
          {
            title: 'Digital Wallet System',
            techStack: ['React', 'TypeScript', 'Express.js', 'MongoDB'],
            description: 'Developed a secure and scalable digital wallet system with user, agent, and admin roles.',
            github: 'https://github.com/Sohag-Ahmed056'
          },
          {
            title: 'TourBuddy: Tour Partner Finder',
            techStack: ['Next.js', 'TypeScript', 'Express.js', 'PostgreSQL', 'Prisma'],
            description: 'Full-stack platform for posting tours, joining others, and receiving AI-powered suggestions based on user preferences.',
            github: 'https://github.com/Sohag-Ahmed056'
          }
        ],
        certifications: [
          'Next Level Web Development Bootcamp – Programming Hero'
        ]
      }
    });

    // Upsert Projects into Project table
    await prisma.project.upsert({
      where: { slug: 'digital-wallet-system' },
      update: {
        title: 'Digital Wallet System',
        description: 'Developed a secure and scalable digital wallet system with user, agent, and admin roles.',
        repoUrl: 'https://github.com/Sohag-Ahmed056',
        features: [
          'JWT-based authentication and role-based route protection',
          'User wallet management, money transfer, transaction history',
          'Agent features for cash-in/cash-out, commissions, approval requests',
          'Admin controls for data monitoring, agent management, wallet blocking',
          'RESTful APIs with search, filter, sort, and pagination'
        ]
      },
      create: {
        title: 'Digital Wallet System',
        slug: 'digital-wallet-system',
        description: 'Developed a secure and scalable digital wallet system with user, agent, and admin roles.',
        repoUrl: 'https://github.com/Sohag-Ahmed056',
        features: [
          'JWT-based authentication and role-based route protection',
          'User wallet management, money transfer, transaction history',
          'Agent features for cash-in/cash-out, commissions, approval requests',
          'Admin controls for data monitoring, agent management, wallet blocking',
          'RESTful APIs with search, filter, sort, and pagination'
        ]
      }
    });

    await prisma.project.upsert({
      where: { slug: 'tourbuddy-tour-partner-finder' },
      update: {
        title: 'TourBuddy: Tour Partner Finder',
        description: 'Developed a full-stack platform for posting tours, joining others, and receiving AI-powered suggestions based on user preferences.',
        repoUrl: 'https://github.com/Sohag-Ahmed056',
        features: [
          'RESTful APIs with Express.js and PostgreSQL/Prisma for user profiles, tour posts, and participation records',
          'AI recommendation engine to analyze user behavior and suggest tailored tour opportunities',
          'Role-based access control (admin/user) and individual chat between travelers',
          'Optimized API endpoints and database queries for high performance under concurrent user load'
        ]
      },
      create: {
        title: 'TourBuddy: Tour Partner Finder',
        slug: 'tourbuddy-tour-partner-finder',
        description: 'Developed a full-stack platform for posting tours, joining others, and receiving AI-powered suggestions based on user preferences.',
        repoUrl: 'https://github.com/Sohag-Ahmed056',
        features: [
          'RESTful APIs with Express.js and PostgreSQL/Prisma for user profiles, tour posts, and participation records',
          'AI recommendation engine to analyze user behavior and suggest tailored tour opportunities',
          'Role-based access control (admin/user) and individual chat between travelers',
          'Optimized API endpoints and database queries for high performance under concurrent user load'
        ]
      }
    });

    console.log('Successfully completed full seeding for Sohag Ali AI Chat Assistant!');
  } catch (error) {
    console.error('Error during seeding:', error);
  }
}

generateAndSeed().then(() => process.exit(0));
