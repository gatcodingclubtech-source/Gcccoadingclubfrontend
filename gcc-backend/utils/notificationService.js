const nodemailer = require('nodemailer');
const Settings = require('../models/Settings');

/**
 * Send automated email and (mock) SMS notifications
 */
const sendRegistrationNotification = async (registration, event) => {
  try {
    const settings = await Settings.findOne();
    
    // 1. Email Notification
    if (settings && settings.smtpEmail && settings.smtpPassword) {
      const transporter = nodemailer.createTransport({
        host: settings.smtpHost || 'smtp.gmail.com',
        port: settings.smtpPort || 587,
        secure: false,
        auth: {
          user: settings.smtpEmail,
          pass: settings.smtpPassword,
        },
      });

      const leader = registration.teamLeader;
      const membersList = registration.members.map(m => m.name).join(', ');

      const mailOptions = {
        from: `"${settings.clubName}" <${settings.smtpEmail}>`,
        to: leader.email,
        subject: `Registration Confirmed: ${event.title}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 600px;">
            <h2 style="color: #10b981;">Registration Successful!</h2>
            <p>Hi <b>${leader.name}</b>,</p>
            <p>You have successfully registered for <b>${event.title}</b>.</p>
            <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p><b>Team Name:</b> ${registration.teamName || 'Solo'}</p>
              <p><b>Registration ID:</b> ${registration._id}</p>
              <p><b>Squad Members:</b> ${membersList}</p>
            </div>
            ${event.officialGroupLink ? `
              <div style="margin: 20px 0;">
                <a href="${event.officialGroupLink}" style="background: #25D366; color: white; padding: 12px 25px; border-radius: 5px; text-decoration: none; font-weight: bold; display: inline-block;">
                  Join Official WhatsApp Group
                </a>
              </div>
            ` : ''}
            <p>See you there!</p>
            <hr>
            <p style="font-size: 12px; color: #888;">This is an automated message from ${settings.clubName}.</p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log(`Email sent to ${leader.email}`);
    } else {
      console.log('SMTP not configured, skipping email.');
    }

    // 2. SMS/WhatsApp Notification (Mocked)
    // In a real scenario, you would call an API like Twilio or WhatsApp Business here
    console.log('------------------------------------');
    console.log('MOCK SMS NOTIFICATION:');
    console.log(`TO: ${registration.teamLeader.phone}`);
    console.log(`MESSAGE: Hi ${registration.teamLeader.name}, your registration for ${event.title} is successful! Reg ID: ${registration._id.slice(-6).toUpperCase()}. Join the group: ${event.officialGroupLink}`);
    console.log('------------------------------------');

  } catch (error) {
    console.error('Notification Error:', error);
  }
};

module.exports = { sendRegistrationNotification };
