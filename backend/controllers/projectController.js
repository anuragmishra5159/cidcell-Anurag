const Project = require('../models/Project');

// @desc    Submit a new project
// @route   POST /api/projects
// @access  Private (student or mentor)
const submitProject = async (req, res) => {
    try {
        const { title, description, type, techStack, githubRepo, deployedLink, images } = req.body;

        if (!title || !description || !type) {
            return res.status(400).json({ message: 'Title, description, and type are required' });
        }
        if (type === 'independent' && !githubRepo && !deployedLink) {
            return res.status(400).json({ message: 'Independent projects require a GitHub repo or deployed link' });
        }

        // Independent projects skip mentor review → go straight to faculty
        const initialStatus = type === 'independent'
            ? 'pending_faculty_review'
            : 'pending_mentor_review';

        const project = await Project.create({
            title,
            description,
            type,
            techStack: Array.isArray(techStack) ? techStack : [],
            githubRepo: githubRepo || '',
            deployedLink: deployedLink || '',
            images: Array.isArray(images) ? images : [],
            createdBy: req.user._id,
            status: initialStatus,
        });

        res.status(201).json(project);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Get all active (public) projects
// @route   GET /api/projects
// @access  Public
const getActiveProjects = async (req, res) => {
    try {
        const projects = await Project.find({ status: 'active' })
            .populate('createdBy', 'username email')
            .populate('contributors.userId', 'username')
            .populate('mentors.userId', 'username')
            .sort({ createdAt: -1 });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Get logged-in user's own projects
// @route   GET /api/projects/mine/all
// @access  Private
const getMyProjects = async (req, res) => {
    try {
        const projects = await Project.find({ createdBy: req.user._id })
            .sort({ createdAt: -1 });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Get single project by ID
// @route   GET /api/projects/:id
// @access  Public
const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('createdBy', 'username email socialLinks')
            .populate('contributors.userId', 'username email')
            .populate('mentors.userId', 'username email')
            .populate('facultyReviewer', 'username')
            .populate('adminApprover', 'username');
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.json(project);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Get projects pending faculty review
// @route   GET /api/projects/review/faculty
// @access  Private (faculty)
const getPendingForFaculty = async (req, res) => {
    try {
        const projects = await Project.find({ status: 'pending_faculty_review' })
            .populate('createdBy', 'username email')
            .sort({ createdAt: -1 });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Get projects pending mentor review
// @route   GET /api/projects/review/mentor
// @access  Private (mentor)
const getPendingForMentor = async (req, res) => {
    try {
        const projects = await Project.find({ status: 'pending_mentor_review' })
            .populate('createdBy', 'username email')
            .sort({ createdAt: -1 });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Get projects pending admin approval
// @route   GET /api/projects/review/admin
// @access  Private (admin)
const getPendingForAdmin = async (req, res) => {
    try {
        const projects = await Project.find({ status: 'pending_admin_approval' })
            .populate('createdBy', 'username email')
            .sort({ createdAt: -1 });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Mentor reviews a collaborative project
// @route   PATCH /api/projects/:id/mentor-review
// @access  Private (mentor)
const mentorReview = async (req, res) => {
    try {
        const { action, feedback } = req.body; // action: 'approve' | 'reject'
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Not found' });
        if (project.status !== 'pending_mentor_review') {
            return res.status(400).json({ message: 'Project is not awaiting mentor review' });
        }

        project.mentorFeedback = feedback || '';
        project.status = action === 'approve' ? 'pending_faculty_review' : 'rejected';
        await project.save();
        res.json(project);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Faculty reviews a project
// @route   PATCH /api/projects/:id/faculty-review
// @access  Private (faculty)
const facultyReview = async (req, res) => {
    try {
        const { action, feedback } = req.body; // action: 'approve' | 'reject'
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Not found' });
        if (project.status !== 'pending_faculty_review') {
            return res.status(400).json({ message: 'Project is not awaiting faculty review' });
        }

        project.facultyFeedback = feedback || '';
        project.facultyReviewer = req.user._id;

        if (action === 'approve') {
            // Independent projects go directly active, collaborative go to admin
            project.status = project.type === 'independent'
                ? 'active'
                : 'pending_admin_approval';
        } else {
            project.status = 'rejected';
        }

        await project.save();
        res.json(project);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Admin reviews a collaborative project
// @route   PATCH /api/projects/:id/admin-review
// @access  Private (admin)
const adminReview = async (req, res) => {
    try {
        const { action, feedback } = req.body;
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Not found' });
        if (project.status !== 'pending_admin_approval') {
            return res.status(400).json({ message: 'Project is not awaiting admin approval' });
        }

        project.adminFeedback = feedback || '';
        project.adminApprover = req.user._id;
        project.status = action === 'approve' ? 'active' : 'rejected';
        await project.save();
        res.json(project);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Student joins an active collaborative project
// @route   POST /api/projects/:id/join
// @access  Private
const joinProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Not found' });
        if (project.status !== 'active') {
            return res.status(400).json({ message: 'You can only join active projects' });
        }
        if (project.type !== 'collaborative') {
            return res.status(400).json({ message: 'Independent projects do not accept contributors' });
        }

        const alreadyJoined = project.contributors.some(
            c => c.userId.toString() === req.user._id.toString()
        );
        if (alreadyJoined) return res.status(400).json({ message: 'Already a contributor' });

        project.contributors.push({ userId: req.user._id });
        await project.save();
        res.json({ message: 'Joined successfully', project });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Admin assigns a mentor to a project
// @route   PATCH /api/projects/:id/add-mentor
// @access  Private (admin)
const addMentorToProject = async (req, res) => {
    try {
        const { mentorId } = req.body;
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Not found' });

        const alreadyMentor = project.mentors.some(
            m => m.userId.toString() === mentorId
        );
        if (alreadyMentor) return res.status(400).json({ message: 'Already a mentor on this project' });

        project.mentors.push({ userId: mentorId });
        await project.save();
        res.json(project);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Get ALL projects (admin view)
// @route   GET /api/projects/all
// @access  Private (admin)
const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find({})
            .populate('createdBy', 'username email')
            .populate('contributors.userId', 'username')
            .populate('mentors.userId', 'username')
            .sort({ createdAt: -1 });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private (admin)
const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (project) {
            await Project.deleteOne({ _id: req.params.id });
            res.json({ message: 'Project removed' });
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    submitProject,
    getActiveProjects,
    getMyProjects,
    getProjectById,
    getPendingForFaculty,
    getPendingForMentor,
    getPendingForAdmin,
    mentorReview,
    facultyReview,
    adminReview,
    joinProject,
    addMentorToProject,
    getAllProjects,
    deleteProject,
};
