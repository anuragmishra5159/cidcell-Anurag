const Member = require('../models/Member');
const User = require('../models/User');

// @desc    Get all members
// @route   GET /api/members
// @access  Public
const getMembers = async (req, res) => {
    try {
        const members = await Member.find({})
            .populate('user', 'username profilePicture socialLinks email batch branch')
            .sort({ order: 1, createdAt: -1 });
        res.json(members);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Add a member (from existing users)
// @route   POST /api/members
// @access  Private/Admin
const addMember = async (req, res) => {
    try {
        const { userId, team, designation, domain, order } = req.body;

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if user is already a member
        const existingMember = await Member.findOne({ user: userId });
        if (existingMember) {
            return res.status(400).json({ message: 'User is already a member' });
        }

        const member = new Member({
            user: userId,
            team,
            designation,
            domain,
            order
        });

        const createdMember = await member.save();
        
        // Populate and return
        const populatedMember = await Member.findById(createdMember._id).populate('user', 'username profilePicture socialLinks email batch branch');
        
        // Also update user userType to 'member' if it was 'student'
        if (user.userType === 'student') {
            user.userType = 'member';
            await user.save();
        }

        res.status(201).json(populatedMember);
    } catch (error) {
        res.status(400).json({ message: error.message || 'Invalid data' });
    }
};

// @desc    Update a member
// @route   PUT /api/members/:id
// @access  Private/Admin
const updateMember = async (req, res) => {
    try {
        const member = await Member.findById(req.params.id);
        if (member) {
            member.team = req.body.team || member.team;
            member.designation = req.body.designation || member.designation;
            member.domain = req.body.domain !== undefined ? req.body.domain : member.domain;
            member.order = req.body.order !== undefined ? req.body.order : member.order;

            const updatedMember = await member.save();
            const populatedMember = await Member.findById(updatedMember._id).populate('user', 'username profilePicture socialLinks email batch branch');
            res.json(populatedMember);
        } else {
            res.status(404).json({ message: 'Member not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message || 'Invalid data' });
    }
};

// @desc    Remove a member
// @route   DELETE /api/members/:id
// @access  Private/Admin
const removeMember = async (req, res) => {
    try {
        const member = await Member.findById(req.params.id);
        if (member) {
            const user = await User.findById(member.user);
            if (user && user.userType === 'member') {
                user.userType = 'student';
                await user.save();
            }
            await Member.deleteOne({ _id: req.params.id });
            res.json({ message: 'Member removed' });
        } else {
            res.status(404).json({ message: 'Member not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Reorder members
// @route   POST /api/members/reorder
// @access  Private/Admin
const reorderMembers = async (req, res) => {
    try {
        const { memberOrders } = req.body; // Array of { id: string, order: number }
        
        const updatePromises = memberOrders.map(async (item) => {
            return Member.findByIdAndUpdate(item.id, { order: item.order });
        });
        
        await Promise.all(updatePromises);
        res.json({ message: 'Members reordered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error reordering members' });
    }
};

module.exports = {
    getMembers,
    addMember,
    updateMember,
    removeMember,
    reorderMembers
};
