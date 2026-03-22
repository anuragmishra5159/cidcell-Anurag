require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Project = require('./models/Project');
const Event = require('./models/Event');
const Member = require('./models/Member');

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing data
        await User.deleteMany({});
        await Project.deleteMany({});
        await Event.deleteMany({});
        await Member.deleteMany({});
        console.log('Existing data cleared.');

        // Create Admin User
        const adminUser = await User.create({
            username: 'Admin User',
            email: 'admin@mitsgwl.ac.in',
            userType: 'Admin',
            profilePicture: 'https://ui-avatars.com/api/?name=Admin+User'
        });

        // Create Faculty User
        const facultyUser = await User.create({
            username: 'Dr. Jane Smith',
            email: 'faculty@mitsgwl.ac.in',
            userType: 'faculty',
            department: 'CSE',
            profilePicture: 'https://ui-avatars.com/api/?name=Jane+Smith'
        });

        // Create Mentor User
        const mentorUser = await User.create({
            username: 'John Doe',
            email: 'mentor@mitsgwl.ac.in',
            userType: 'mentor',
            domainOfExpertise: 'Web Development',
            department: 'CSE',
            profilePicture: 'https://ui-avatars.com/api/?name=John+Doe'
        });

        // Create Student User
        const studentUser = await User.create({
            username: 'Alice Smith',
            email: 'student@mitsgwl.ac.in',
            userType: 'student',
            branch: 'CSE',
            batch: '2023-2027',
            profilePicture: 'https://ui-avatars.com/api/?name=Alice+Smith'
        });

        console.log('Users created.');

        // Create Projects
        await Project.create([
            {
                title: 'AI Playground',
                description: 'An interactive platform to experiment with various AI models.',
                type: 'independent',
                techStack: ['React', 'Node.js', 'OpenAI'],
                createdBy: studentUser._id,
                status: 'active',
                githubRepo: 'https://github.com/example/ai-playground'
            },
            {
                title: 'Smart Campus',
                description: 'IoT-based solution for efficient campus management.',
                type: 'collaborative',
                techStack: ['Python', 'Arduino', 'React'],
                createdBy: studentUser._id,
                status: 'active',
                contributors: [{ userId: studentUser._id }]
            }
        ]);
        console.log('Projects created.');

        // Create Events
        await Event.create([
            {
                title: 'Web Dev Workshop',
                description: 'Hands-on workshop on modern web development techniques.',
                date: '2026-04-15',
                time: '10:00 AM',
                location: 'CSE Block Room 301',
                organizer: 'CID Cell',
                organizerEmail: 'cid@mitsgwl.ac.in',
                createdBy: adminUser._id,
                isScheduled: true,
                category: 'tech',
                whatsappGroupLink: 'https://chat.whatsapp.com/example'
            },
            {
                title: 'Innovation Hackathon',
                description: 'A 24-hour hackathon to solve real-world problems.',
                date: '2026-05-20',
                time: '09:00 AM',
                location: 'College Auditorium',
                organizer: 'MITS Gwalior',
                organizerEmail: 'info@mitsgwl.ac.in',
                createdBy: adminUser._id,
                isScheduled: true,
                category: 'tech',
                whatsappGroupLink: 'https://chat.whatsapp.com/example'
            }
        ]);
        console.log('Events created.');

        // Create Team Members
        await Member.create([
            {
                user: adminUser._id,
                team: 'Core Team',
                designation: 'Lead Developer',
                domain: 'Full Stack',
                order: 1
            },
            {
                user: studentUser._id,
                team: 'Sub-Teams',
                designation: 'Developer',
                domain: 'Front-end',
                order: 2
            }
        ]);
        console.log('Team members created.');

        console.log('Seeding completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding data:', err);
        process.exit(1);
    }
};

seedData();
