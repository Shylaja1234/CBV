const { PrismaClient } = require('@prisma/client');
const nodemailer = require('nodemailer');
const prisma = new PrismaClient();

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NOTIFY_EMAIL, // Notification sender email
    pass: process.env.NOTIFY_EMAIL_PASSWORD // App password for sender
  }
});

// Submit a new message (contact form)
const submitMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const newMessage = await prisma.message.create({
      data: { name, email, subject, message }
    });

    // Send email to admin
    await transporter.sendMail({
      from: process.env.NOTIFY_EMAIL,
      to: process.env.ADMIN_EMAIL, // Admin receives the notification
      subject: `New Contact Message: ${subject}`,
      text: `From: ${name} <${email}>\nSubject: ${subject}\n\n${message}`
    });

    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error submitting message:', error);
    res.status(500).json({ error: 'Failed to submit message' });
  }
};

// ... rest of the code remains unchanged ... 