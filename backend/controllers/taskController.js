const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Create a task for an active project
// @route   POST /api/tasks
// @access  Private (mentor)
const createTask = async (req, res) => {
    try {
        const { projectId, title, description } = req.body;
        const project = await Project.findById(projectId);
        if (!project) return res.status(404).json({ message: 'Project not found' });
        if (project.status !== 'active') {
            return res.status(400).json({ message: 'Tasks can only be created for active projects' });
        }

        const task = await Task.create({
            projectId,
            title,
            description: description || '',
            createdBy: req.user._id,
        });
        res.status(201).json(task);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// @desc    Get all tasks for a project
// @route   GET /api/tasks/project/:projectId
// @access  Private
const getTasksByProject = async (req, res) => {
    try {
        const tasks = await Task.find({ projectId: req.params.projectId })
            .populate('assignedTo', 'username email')
            .populate('createdBy', 'username')
            .sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Student picks (self-assigns) a task
// @route   PATCH /api/tasks/:id/pick
// @access  Private
const pickTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        if (task.status !== 'todo') {
            return res.status(400).json({ message: 'Task is not available' });
        }

        task.assignedTo = req.user._id;
        task.status = 'in_progress';
        await task.save();
        res.json(task);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Student submits a PR link for their task
// @route   PATCH /api/tasks/:id/submit-pr
// @access  Private
const submitPR = async (req, res) => {
    try {
        const { prLink } = req.body;
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        if (task.assignedTo?.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You are not assigned to this task' });
        }
        if (task.status !== 'in_progress') {
            return res.status(400).json({ message: 'Task must be in progress to submit a PR' });
        }

        task.prLink = prLink;
        task.status = 'review';
        await task.save();
        res.json(task);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// @desc    Mentor reviews a task PR (approve/reject)
// @route   PATCH /api/tasks/:id/review
// @access  Private (mentor)
const reviewTask = async (req, res) => {
    try {
        const { action, feedback } = req.body; // action: 'approve' | 'reject'
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        if (task.status !== 'review') {
            return res.status(400).json({ message: 'Task is not in review' });
        }

        task.reviewedBy = req.user._id;
        task.mentorFeedback = feedback || '';

        if (action === 'approve') {
            task.status = 'done';
            // Update project's lastActivityAt
            await Project.findByIdAndUpdate(task.projectId, { lastActivityAt: new Date() });
        } else {
            task.status = 'in_progress'; // send back for revision
            task.prLink = '';
        }

        await task.save();
        res.json(task);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    createTask,
    getTasksByProject,
    pickTask,
    submitPR,
    reviewTask,
};
