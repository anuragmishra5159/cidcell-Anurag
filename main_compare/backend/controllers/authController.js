const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Generate JWT token for session
 */
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

/**
 * @desc    Google login / registration
 * @route   POST /api/auth/google
 * @access  Public
 */
const googleLogin = async (req, res) => {
    try {
        const { idToken } = req.body;

        if (!idToken) {
            return res.status(400).json({ message: 'No Google token provided' });
        }

        // Wait until env variable is definitely loaded/trimmed
        const clientId = process.env.GOOGLE_CLIENT_ID.trim();

        // Verify the Google ID token
        const ticket = await client.verifyIdToken({
            idToken,
            audience: clientId,
        });

        const payload = ticket.getPayload();
        const { sub: googleId, email, name, picture } = payload;

        // Check for allowed email domains
        if (!email.endsWith('@mitsgwalior.in') && !email.endsWith('@mitsgwl.ac.in')) {
            return res.status(403).json({
                message: 'Only @mitsgwalior.in and @mitsgwl.ac.in domains are allowed.'
            });
        }

        // Check if user exists
        let user = await User.findOne({ email });
        let isNewUser = false; // Flag to identify a fresh registration

        if (!user) {
            isNewUser = true; // Mark as new so frontend can trigger Onboarding

            // Handle MITS Identity Parsing
            // Rule: Enrollment is the first part of the Google Profile Name (e.g. "BTIT24O1058 HARSH MANMODE")
            // Actual Name is everything following that.
            const googleName = name.trim();
            const nameParts = googleName.split(/\s+/);
            const firstPart = nameParts[0].toUpperCase();

            // Validate if first part is an Enrollment Number (e.g., BTIT24O1058, 0101CS221001)
            // Pattern: Alphanumeric, 8-12 length, must contain at least one digit
            const isEnrollmentPattern = /^[A-Z0-9]{8,12}$/.test(firstPart) && /[0-9]/.test(firstPart);

            let enrollmentNo = "";
            let username = "";

            if (isEnrollmentPattern) {
                enrollmentNo = firstPart;
                // Strip the enrollment code from the name to get just the human name
                username = nameParts.slice(1).join(' ').toUpperCase();
                // If for some reason the name was ONLY the enrollment, default to the full name
                if (!username) username = googleName.toUpperCase();
            } else {
                // Fallback to email prefix (trash part) ONLY if Google Name is missing enrollment
                enrollmentNo = email.split('@')[0].toUpperCase();
                username = googleName.toUpperCase();
            }

            // Create new user if they don't exist
            user = await User.create({
                username: username,
                enrollmentNo: enrollmentNo,
                email,
                googleId,
                profilePicture: picture || '',
            });
        } else if (!user.googleId) {
            // If user exists but googleId is not set (e.g., they registered via email earlier but now using Google)
            user.googleId = googleId;
            if (!user.profilePicture) user.profilePicture = picture || '';
            await user.save();
        }

        // Generate JWT token for session
        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            isNewUser, // Send this flag to frontend
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                enrollmentNo: user.enrollmentNo,
                branch: user.branch,
                batch: user.batch,
                skills: user.skills,
                socialLinks: user.socialLinks,
                profilePicture: user.profilePicture,
                userType: user.userType,
            },
        });
    } catch (error) {
        console.error('Google Auth Error:', error);
        res.status(401).json({ message: 'Invalid Google Identity token', error: error.message });
    }
};

/**
 * @desc    Get current logged in user profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error('Profile Fetch Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * @desc    Update user profile details
 * @route   PUT /api/auth/profile
 * @access  Private
 */
const updateProfile = async (req, res) => {
    try {
        const { enrollmentNo, branch, batch, skills, socialLinks } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update fields if provided
        if (enrollmentNo !== undefined) user.enrollmentNo = enrollmentNo;
        if (branch !== undefined) user.branch = branch;
        if (batch !== undefined) user.batch = batch;
        if (skills !== undefined) user.skills = skills;
        if (socialLinks !== undefined) {
            user.socialLinks = { ...user.socialLinks, ...socialLinks };
        }

        await user.save();

        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error('Profile Update Error:', error);
        if (error.code === 11000) { // Duplicate key error
            return res.status(400).json({ message: 'Enrollment Number or other unique field already in use' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    googleLogin,
    getProfile,
    updateProfile
};
