const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

const sendJoinRequestStatusEmail = async (userEmail, projectName, status) => {
    try {
        const mailOptions = {
            from: process.env.MAIL_USER,
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
            from: process.env.MAIL_USER,
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
            from: process.env.MAIL_USER,
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

module.exports = {
    sendJoinRequestStatusEmail,
    sendDoubtSessionRequestEmail,
    sendEventApprovalEmail
};
