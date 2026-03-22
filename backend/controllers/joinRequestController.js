const JoinRequest = require('../models/JoinRequest');
const Project = require('../models/Project');
const Notification = require('../models/Notification');

// @desc    Student submits a join request
// @route   POST /api/join-requests
// @access  Private (student only)
const submitJoinRequest = async (req, res) => {
    try {
        const { projectId, message, skills } = req.body;

        if (!projectId || !message) {
            return res.status(400).json({ message: 'projectId and message are required' });
        }
        if (message.length < 30) {
            return res.status(400).json({ message: 'Message must be at least 30 characters' });
        }

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        if (project.status !== 'active') {
            return res.status(400).json({ message: 'You can only request to join active projects' });
        }
        if (project.type !== 'collaborative') {
            return res.status(400).json({ message: 'Independent projects do not accept contributors' });
        }

        // Check if user is the project creator
        if (project.createdBy.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: 'You are the creator of this project' });
        }

        // Check if already a contributor
        const alreadyContributor = project.contributors.some(
            c => c.userId.toString() === req.user._id.toString()
        );
        if (alreadyContributor) {
            return res.status(400).json({ message: 'You are already a contributor on this project' });
        }

        // Check for existing pending request
        const existingPending = await JoinRequest.findOne({
            userId: req.user._id,
            projectId,
            status: 'pending',
        });
        if (existingPending) {
            return res.status(400).json({ message: 'You already have a pending request for this project' });
        }

        // Check reapply cooldown (if previously rejected)
        const lastRejected = await JoinRequest.findOne({
            userId: req.user._id,
            projectId,
            status: 'rejected',
        }).sort({ reviewedAt: -1 });

        if (lastRejected && lastRejected.reapplyAfter && lastRejected.reapplyAfter > new Date()) {
            const daysLeft = Math.ceil((lastRejected.reapplyAfter - new Date()) / (1000 * 60 * 60 * 24));
            return res.status(400).json({
                message: `You were previously rejected. You can re-apply in ${daysLeft} day(s).`,
                reapplyAfter: lastRejected.reapplyAfter,
            });
        }

        const joinRequest = await JoinRequest.create({
            userId: req.user._id,
            projectId,
            message,
            skills: Array.isArray(skills) ? skills : [],
        });

        // Phase 2: Create notification for the creator
        const notification = await Notification.create({
            userId: project.createdBy,
            type: 'join_request',
            message: `${req.user.username} requested to join project "${project.title}"`,
            link: `/projects/${project._id}`
        });

        // Emit real-time socket event
        const io = req.app.get('io');
        if (io) {
            io.to(project.createdBy.toString()).emit('new_notification', notification);
        }

        res.status(201).json({ success: true, joinRequest });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Get all join requests for a project (creator only)
// @route   GET /api/join-requests/project/:projectId
// @access  Private (project creator)
const getProjectJoinRequests = async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        if (project.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Only the project creator can view join requests' });
        }

        const statusFilter = req.query.status || 'all';

        let query = { projectId: req.params.projectId };
        if (statusFilter !== 'all') {
            query.status = statusFilter;
        }

        const requests = await JoinRequest.find(query)
            .populate('userId', 'username email profilePicture skills')
            .sort({ createdAt: -1 });

        const pending = requests.filter(r => r.status === 'pending');
        const reviewed = requests.filter(r => r.status !== 'pending');

        res.json({ pending, reviewed });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Student checks their join request status for a project
// @route   GET /api/join-requests/my-status/:projectId
// @access  Private (any logged-in user)
const getMyRequestStatus = async (req, res) => {
    try {
        const request = await JoinRequest.findOne({
            userId: req.user._id,
            projectId: req.params.projectId,
        }).sort({ createdAt: -1 });

        if (!request) {
            return res.json({ status: null });
        }

        res.json({
            status: request.status,
            reapplyAfter: request.reapplyAfter || null,
            reviewedAt: request.reviewedAt || null,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Creator accepts a join request
// @route   PATCH /api/join-requests/:requestId/accept
// @access  Private (project creator)
const acceptJoinRequest = async (req, res) => {
    try {
        const joinRequest = await JoinRequest.findById(req.params.requestId);
        if (!joinRequest) {
            return res.status(404).json({ message: 'Join request not found' });
        }
        if (joinRequest.status !== 'pending') {
            return res.status(400).json({ message: 'This request has already been reviewed' });
        }

        const project = await Project.findById(joinRequest.projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        if (project.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Only the project creator can accept requests' });
        }

        // Update join request status
        joinRequest.status = 'accepted';
        joinRequest.reviewedAt = new Date();
        await joinRequest.save();

        // Add to project contributors
        project.contributors.push({
            userId: joinRequest.userId,
            joinedAt: new Date(),
        });
        await project.save();

        // Phase 2: Create notification for the student
        const notification = await Notification.create({
            userId: joinRequest.userId,
            type: 'system',
            message: `Your request to join "${project.title}" has been ACCEPTED.`,
            link: `/projects/${project._id}`
        });

        const io = req.app.get('io');
        if (io) {
            io.to(joinRequest.userId.toString()).emit('new_notification', notification);
        }

        res.json({ success: true, joinRequest });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Creator rejects a join request
// @route   PATCH /api/join-requests/:requestId/reject
// @access  Private (project creator)
const rejectJoinRequest = async (req, res) => {
    try {
        const joinRequest = await JoinRequest.findById(req.params.requestId);
        if (!joinRequest) {
            return res.status(404).json({ message: 'Join request not found' });
        }
        if (joinRequest.status !== 'pending') {
            return res.status(400).json({ message: 'This request has already been reviewed' });
        }

        const project = await Project.findById(joinRequest.projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        if (project.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Only the project creator can reject requests' });
        }

        // Update join request status with 7-day cooldown
        joinRequest.status = 'rejected';
        joinRequest.reviewedAt = new Date();
        joinRequest.reapplyAfter = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
        await joinRequest.save();

        // Phase 2: Create notification for the student
        const notification = await Notification.create({
            userId: joinRequest.userId,
            type: 'system',
            message: `Your request to join "${project.title}" was rejected.`,
            link: `/projects/${project._id}`
        });

        const io = req.app.get('io');
        if (io) {
            io.to(joinRequest.userId.toString()).emit('new_notification', notification);
        }

        res.json({ success: true, joinRequest });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    submitJoinRequest,
    getProjectJoinRequests,
    getMyRequestStatus,
    acceptJoinRequest,
    rejectJoinRequest,
};
