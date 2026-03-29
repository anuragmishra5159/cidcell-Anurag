const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const { getRetroWelcomeTemplate } = require('./emailTemplate');
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    },
    // Connection pool — reuse SMTP connection instead of creating a new one per email
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
});

// Verify transporter config on startup (non-blocking)
transporter.verify((error) => {
    if (error) {
        console.error('❌ Nodemailer transporter verification failed:', error.message);
    } else {
        console.log('✅ Nodemailer is ready to send emails');
    }
});

/**
 * Send a welcome email to a newly registered user.
 * Uses the retro-themed HTML template from emailTemplate.js.
 * @param {Object} user - Mongoose user document
 */
const sendWelcomeEmail = async (user) => {
    try {
        const html = getRetroWelcomeTemplate(user);
        const mailOptions = {
            from: `"CID Cell MITS" <${process.env.MAIL_USER}>`,
            to: user.email,
            subject: '🎮 ACCESS GRANTED — Welcome to CID Cell!',
            html,
            attachments: [
                {
                    filename: 'logo.png',
                    path: require('path').join(__dirname, '../assets/logo.png'),
                    cid: 'logo', // Referenced as cid:logo in the email template
                }
            ]
        };
        await transporter.sendMail(mailOptions);
        console.log(`✅ Welcome email sent to ${user.email}`);
    } catch (error) {
        console.error('❌ Error sending welcome email:', error.message);
        throw error; // Re-throw so the caller can catch (logged non-fatally in authController)
    }
};

/**
 * Returns rendered HTML for browser preview of the welcome email template.
 * Used by GET /api/auth/template-preview
 */
const getPreviewHtml = () => {
    return getRetroWelcomeTemplate({
        username: 'PREVIEW USER',
        branch: 'Computer Science',
        batch: '2024',
        email: 'preview@mitsgwl.ac.in',
    });
};

const sendJoinRequestStatusEmail = async (userEmail, projectName, status) => {
    try {
        const mailOptions = {
            from: `"CID Cell MITS" <${process.env.MAIL_USER}>`,
            to: userEmail,
            subject: `Update on your Join Request for ${projectName}`,
            html: `<h3>Hello,</h3>
                   <p>Your join request for the project <b>${projectName}</b> has been <b>${status}</b>.</p>
                   <p>Regards,<br>CID-Cell Team</p>`
        };
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${userEmail} regarding join request ${status}`);
    } catch (error) {
        console.error("Error sending join request email:", error);
    }
};

const sendDoubtSessionRequestEmail = async (mentorEmail, studentName, domain) => {
    try {
        const mailOptions = {
            from: `"CID Cell MITS" <${process.env.MAIL_USER}>`,
            to: mentorEmail,
            subject: `New Doubt Session Request from ${studentName}`,
            html: `<h3>Hello Mentor,</h3>
                   <p>You have a new doubt session request from <b>${studentName}</b> regarding <b>${domain}</b>.</p>
                   <p>Please log in to your dashboard to review it.</p>
                   <p>Regards,<br>CID-Cell Team</p>`
        };
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to mentor ${mentorEmail} regarding doubt session`);
    } catch (error) {
        console.error("Error sending doubt session email:", error);
    }
};

const sendEventApprovalEmail = async (organizerEmail, eventName) => {
    try {
        const mailOptions = {
            from: `"CID Cell MITS" <${process.env.MAIL_USER}>`,
            to: organizerEmail,
            subject: `Event Proposal Approved: ${eventName}`,
            html: `<h3>Great News!</h3>
                   <p>Your event proposal for <b>${eventName}</b> has been <b>approved</b> by the administration!</p>
                   <p>Regards,<br>CID-Cell Team</p>`
        };
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to organizer ${organizerEmail} regarding event approval`);
    } catch (error) {
        console.error("Error sending event approval email:", error);
    }
};

const sendEventRegistrationEmail = async (userEmail, userName, eventName, date, time) => {
    try {
        const mailOptions = {
            from: `"CID Cell MITS" <${process.env.MAIL_USER}>`,
            to: userEmail,
            subject: `RSVP Confirmed: ${eventName}`,
            html: `<h3>Hello ${userName},</h3>
                   <p>Your registration for the event <b>${eventName}</b> has been successfully confirmed!</p>
                   <p><b>Date:</b> ${date}<br><b>Time:</b> ${time || 'TBD'}</p>
                   <p>You can manage your registrations from your CID Cell dashboard.</p>
                   <p>Regards,<br>CID-Cell Team</p>`
        };
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${userEmail} regarding registration for ${eventName}`);
    } catch (error) {
        console.error("Error sending registration email:", error);
    }
};

module.exports = {
    sendWelcomeEmail,
    getPreviewHtml,
    sendJoinRequestStatusEmail,
    sendDoubtSessionRequestEmail,
    sendEventApprovalEmail,
    sendEventRegistrationEmail
};
