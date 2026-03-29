const Project = require('../models/Project');
const JoinRequest = require('../models/JoinRequest');

// @desc    Submit a new project
// @route   POST /api/projects
// @access  Private (student or mentor)
const submitProject = async (req, res) => {
    try {
        const { title, description, type, techStack, githubRepo, deployedLink, images } = req.body;

        // Basic validation (Zod schema runs first via route middleware)
        if (type === 'independent' && !githubRepo && !deployedLink) {
            return res.status(400).json({ message: 'Independent projects require a GitHub repo or deployed link' });
        }

        // Trusted users (faculty, admin, hod) skip reviews and go straight to active
        let initialStatus;
        const userType = req.user.userType?.toLowerCase();

        if (['faculty', 'admin', 'hod'].includes(userType)) {
            initialStatus = 'active';
        } else {
            initialStatus = type === 'independent'
                ? 'pending_faculty_review'
                : 'pending_mentor_review';
        }

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
        const { search, techStack } = req.query;
        let query = { status: 'active' };

        if (search) {
            // Sanitise regex — escape special chars to prevent injection
            const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            query.title = { $regex: escaped, $options: 'i' };
        }
        if (techStack) {
            const stacks = techStack.split(',').map(s => s.trim()).filter(Boolean);
            if (stacks.length > 0) {
                query.techStack = { $in: stacks };
            }
        }

        const projects = await Project.find(query)
            .populate('createdBy', 'username email')
            .populate('contributors.userId', 'username')
            .populate('mentors.userId', 'username')
            .sort({ createdAt: -1 })
            .lean();

        // ── Fix N+1: single batch query instead of per-project countDocuments ────
        if (req.user && projects.length > 0) {
            const userId = req.user._id?.toString() || req.user.id?.toString();
            const ownedProjectIds = projects
                .filter(p => p.createdBy && p.createdBy._id?.toString() === userId && p.type === 'collaborative')
                .map(p => p._id);

            if (ownedProjectIds.length > 0) {
                const pendingCounts = await JoinRequest.aggregate([
                    { $match: { projectId: { $in: ownedProjectIds }, status: 'pending' } },
                    { $group: { _id: '$projectId', count: { $sum: 1 } } },
                ]);
                const countMap = Object.fromEntries(pendingCounts.map(c => [c._id.toString(), c.count]));
                projects.forEach(p => {
                    if (ownedProjectIds.some(id => id.toString() === p._id.toString())) {
                        p.pendingJoinRequests = countMap[p._id.toString()] || 0;
                    }
                });
            }
        }

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
            .sort({ createdAt: -1 })
            .lean();

        // ── Fix N+1: batch count for owned collaborative projects ─────────────
        const collabIds = projects.filter(p => p.type === 'collaborative').map(p => p._id);
        if (collabIds.length > 0) {
            const pendingCounts = await JoinRequest.aggregate([
                { $match: { projectId: { $in: collabIds }, status: 'pending' } },
                { $group: { _id: '$projectId', count: { $sum: 1 } } },
            ]);
            const countMap = Object.fromEntries(pendingCounts.map(c => [c._id.toString(), c.count]));
            projects.forEach(p => {
                if (p.type === 'collaborative') {
                    p.pendingJoinRequests = countMap[p._id.toString()] || 0;
                }
            });
        }

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
            .populate('createdBy', 'username email userType profilePicture socialLinks')
            .populate('contributors.userId', 'username email userType profilePicture')
            .populate('mentors.userId', 'username email userType profilePicture')
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
        const { action, feedback } = req.body;
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
        const { action, feedback } = req.body;
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Not found' });
        if (project.status !== 'pending_faculty_review') {
            return res.status(400).json({ message: 'Project is not awaiting faculty review' });
        }

        project.facultyFeedback = feedback || '';
        project.facultyReviewer = req.user._id;

        if (action === 'approve') {
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

// @desc    Get ALL projects (admin view) — paginated
// @route   GET /api/projects/all?page=1&limit=20
// @access  Private (admin)
const getAllProjects = async (req, res) => {
    try {
        const page  = Math.max(1, parseInt(req.query.page, 10)  || 1);
        const limit = Math.min(100, parseInt(req.query.limit, 10) || 20);
        const skip  = (page - 1) * limit;

        const [total, projects] = await Promise.all([
            Project.countDocuments({}),
            Project.find({})
                .populate('createdBy', 'username email')
                .populate('contributors.userId', 'username')
                .populate('mentors.userId', 'username')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
        ]);

        res.json({ data: projects, total, page, pages: Math.ceil(total / limit) });
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

// @desc    Update a contributor's role (creator only)
// @route   PATCH /api/projects/:id/contributors/:userId/role
// @access  Private
const updateContributorRole = async (req, res) => {
    try {
        const { id, userId } = req.params;
        const { role } = req.body;

        const validRoles = ['developer', 'tester', 'designer', 'viewer'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        const project = await Project.findById(id);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        if (project.createdBy.toString() !== (req.user._id?.toString() || req.user.id)) {
            return res.status(403).json({ message: 'Only the project creator can update roles' });
        }

        const contributorIndex = project.contributors.findIndex(c => c.userId.toString() === userId);
        if (contributorIndex === -1) {
            return res.status(404).json({ message: 'Contributor not found' });
        }

        project.contributors[contributorIndex].role = role;
        await project.save();
        res.json({ success: true, project });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Update a contributor's level (creator only)
// @route   PATCH /api/projects/:id/contributors/:userId/level
// @access  Private
const updateContributorLevel = async (req, res) => {
    try {
        const { id, userId } = req.params;
        const { level } = req.body;

        const validLevels = ['new_contributor', 'active_contributor', 'core_member'];
        if (!validLevels.includes(level)) {
            return res.status(400).json({ message: 'Invalid level' });
        }

        const project = await Project.findById(id);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        if (project.createdBy.toString() !== (req.user._id?.toString() || req.user.id)) {
            return res.status(403).json({ message: 'Only the project creator can update levels' });
        }

        const contributorIndex = project.contributors.findIndex(c => c.userId.toString() === userId);
        if (contributorIndex === -1) {
            return res.status(404).json({ message: 'Contributor not found' });
        }

        project.contributors[contributorIndex].level = level;
        await project.save();
        res.json({ success: true, project });
    } catch (err) {
        res.status(500).json({ message: err.message });
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
    addMentorToProject,
    getAllProjects,
    deleteProject,
    updateContributorRole,
    updateContributorLevel,
};
