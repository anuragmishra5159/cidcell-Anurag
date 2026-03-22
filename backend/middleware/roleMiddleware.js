const Project = require('../models/Project');

const checkContributorLevel = (requiredLevel) => {
    return async (req, res, next) => {
        try {
            const projectId = req.params.projectId || req.body.projectId;
            const taskId = req.params.id; // for task routes like /api/tasks/:id/pick

            let actualProjectId = projectId;

            if (!actualProjectId && taskId) {
                const Task = require('../models/Task');
                const task = await Task.findById(taskId);
                if (task) actualProjectId = task.projectId;
            }

            if (!actualProjectId) {
                return res.status(400).json({ message: 'Project ID not found in request' });
            }

            const project = await Project.findById(actualProjectId);
            if (!project) return res.status(404).json({ message: 'Project not found' });

            const isCreator = project.createdBy.toString() === req.user._id.toString();
            if (isCreator) return next();

            const contributor = project.contributors.find(c => c.userId.toString() === req.user._id.toString());
            if (!contributor) return res.status(403).json({ message: 'You are not a contributor to this project' });

            const levels = ['new_contributor', 'active_contributor', 'core_member'];
            const userLevelIndex = levels.indexOf(contributor.level);
            const reqLevelIndex = levels.indexOf(requiredLevel);

            if (userLevelIndex < reqLevelIndex) {
                return res.status(403).json({ message: `Requires ${requiredLevel} access. Your level: ${contributor.level}` });
            }

            next();
        } catch (err) {
            res.status(500).json({ message: 'Server Error in role check', error: err.message });
        }
    };
};

module.exports = { checkContributorLevel };
