const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Create a task for an active project
// @route   POST /api/tasks
// @access  Private (Creator, Mentor, Core)
const createTask = async (req, res) => {
    try {
        const { projectId, title, description, assignedTo, difficulty } = req.body;
        const project = await Project.findById(projectId);
        if (!project) return res.status(404).json({ message: 'Project not found' });
        if (project.status !== 'active') {
            return res.status(400).json({ message: 'Tasks can only be created for active projects' });
        }

        const isCreator = project.createdBy.toString() === req.user._id.toString();
        const isMentor = req.user.userType === 'mentor' || req.user.userType === 'admin' || project.mentors?.some(m => m.userId.toString() === req.user._id.toString());
        const isCore = project.contributors?.some(c => c.userId.toString() === req.user._id.toString() && c.level === 'core_member');

        if (!isCreator && !isMentor && !isCore) {
            return res.status(403).json({ message: 'Only Project Creators, Mentors, or Core Members can create tasks' });
        }

        const task = await Task.create({
            projectId,
            title,
            description: description || '',
            assignedTo: assignedTo || null,
            difficulty: difficulty || 'small',
            createdBy: req.user._id,
        });

        const populatedTask = await Task.findById(task._id)
            .populate('assignedTo', 'username email')
            .populate('createdBy', 'username');

        res.status(201).json(populatedTask);
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

        // Update contributor lastActive
        await Project.findOneAndUpdate(
            { _id: task.projectId, 'contributors.userId': req.user._id },
            { $set: { 'contributors.$.lastActive': new Date() } }
        );

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

        // Update contributor lastActive
        await Project.findOneAndUpdate(
            { _id: task.projectId, 'contributors.userId': req.user._id },
            { $set: { 'contributors.$.lastActive': new Date() } }
        );

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
            if (task.assignedTo) {
                const project = await Project.findById(task.projectId);
                if (project) {
                    project.lastActivityAt = new Date();
                    const contributor = project.contributors.find(c => c.userId.toString() === task.assignedTo.toString());
                    if (contributor) {
                        contributor.score += 10;
                        contributor.lastActive = new Date();
                        
                        // Auto-promotion based on score (only to active_contributor)
                        // core_member requires owner confirmation
                        if (contributor.score >= 50 && contributor.level === 'new_contributor') {
                            contributor.level = 'active_contributor';
                        }
                    }
                    await project.save();
                }
            }
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

// @desc    Arbitrary state update for Kanban drag-and-drop
// @route   PATCH /api/tasks/:id/status
// @access  Private
const updateTaskStatus = async (req, res) => {
    try {
        const { status, assignedTo } = req.body;
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        
        const project = await Project.findById(task.projectId);
        if (!project) return res.status(404).json({ message: 'Project not found' });
        
        // Authorization: Creator, Mentor, or the assignee themselves
        const isCreator = project.createdBy.toString() === req.user._id.toString();
        const isMentor = project.mentors?.some(m => m.userId.toString() === req.user._id.toString());
        const isAssigned = task.assignedTo?.toString() === req.user._id.toString();
        const isAdminOrMentorGlobal = req.user.userType === 'mentor' || req.user.userType === 'admin' || req.user.userType === 'faculty';
        const isCore = project.contributors?.some(c => c.userId.toString() === req.user._id.toString() && c.level === 'core_member');
        
        if (!isCreator && !isMentor && !isAssigned && !isAdminOrMentorGlobal && !isCore) {
            // Allow general contributors to pick tasks from "todo" to "in_progress"
            const isContributor = project.contributors?.some(c => c.userId.toString() === req.user._id.toString());
            if (isContributor && task.status === 'todo' && status === 'in_progress') {
                // allowed to self-assign
                task.assignedTo = req.user._id;
            } else {
                return res.status(403).json({ message: 'Unauthorized to move this task' });
            }
        }

        task.status = status;
        if (assignedTo !== undefined) task.assignedTo = assignedTo || null;
        
        await task.save();

        // Update contributor activity marker
        await Project.findOneAndUpdate(
            { _id: task.projectId, 'contributors.userId': req.user._id },
            { $set: { 'contributors.$.lastActive': new Date() } }
        );

        const populatedTask = await Task.findById(task._id)
            .populate('assignedTo', 'username email')
            .populate('createdBy', 'username');

        res.json(populatedTask);
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
    updateTaskStatus,
};
