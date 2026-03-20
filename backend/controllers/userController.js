const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10);
        const limit = parseInt(req.query.limit, 10);
        
        if (page && limit) {
            const skip = (page - 1) * limit;
            const total = await User.countDocuments();
            const users = await User.find({})
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);
            
            return res.json({
                data: users,
                total,
                page,
                pages: Math.ceil(total / limit)
            });
        }

        const users = await User.find({}).sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
    try {
        console.log('Fetching user by ID:', req.params.id);
        const user = await User.findById(req.params.id);
        if (user) {
            res.json(user);
        } else {
            console.warn('User not found:', req.params.id);
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching user:', req.params.id, error);
        res.status(500).json({ message: error.message, stack: error.stack });
    }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            user.username = req.body.username || user.username;
            user.email = req.body.email || user.email;
            user.enrollmentNo = req.body.enrollmentNo || user.enrollmentNo;
            user.branch = req.body.branch || user.branch;
            user.batch = req.body.batch || user.batch;
            user.userType = req.body.userType || user.userType;
            user.domainOfExpertise = req.body.domainOfExpertise || user.domainOfExpertise;
            user.department = req.body.department || user.department;
            if (typeof req.body.aboutMentor !== 'undefined') user.aboutMentor = req.body.aboutMentor;
            
            if (req.body.expertise) {
                user.expertise = Array.isArray(req.body.expertise)
                    ? req.body.expertise
                    : req.body.expertise.split(',').map(s => s.trim()).filter(Boolean);
            }
            
            // Handle skills (expecting array or comma-separated string)
            if (req.body.skills) {
                user.skills = Array.isArray(req.body.skills) 
                    ? req.body.skills 
                    : req.body.skills.split(',').map(s => s.trim());
            }

            // Handle social links
            if (req.body.socialLinks) {
                user.socialLinks = {
                    linkedin: req.body.socialLinks.linkedin || user.socialLinks.linkedin,
                    github: req.body.socialLinks.github || user.socialLinks.github,
                    leetcode: req.body.socialLinks.leetcode || user.socialLinks.leetcode,
                    other: req.body.socialLinks.other || user.socialLinks.other,
                };
            }

            const updatedUser = await user.save();
            res.json(updatedUser);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            await User.deleteOne({ _id: user._id });
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all mentors (publicly searchable by domain)
// @route   GET /api/users/mentors
// @access  Private
const getMentors = async (req, res) => {
    try {
        const { domain } = req.query;
        let query = { userType: 'mentor' };
        
        if (domain) {
            query.domainOfExpertise = { $regex: domain, $options: 'i' };
        }

        const mentors = await User.find(query)
            .select('username profilePicture domainOfExpertise department aboutMentor expertise')
            .sort({ createdAt: -1 });
            
        res.json(mentors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    getMentors,
};
