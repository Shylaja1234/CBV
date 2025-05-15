import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';
const prisma = new PrismaClient();

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NOTIFY_EMAIL,
    pass: process.env.NOTIFY_EMAIL_PASSWORD
  }
});

// Submit a new message (contact form)
export const submitMessage = async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = req.body;
    const newMessage = await prisma.message.create({
      data: { name, email, subject, message }
    });
    await transporter.sendMail({
      from: process.env.NOTIFY_EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject: `New Contact Message: ${subject}`,
      text: `From: ${name} <${email}>\nSubject: ${subject}\n\n${message}`
    });
    res.status(201).json(newMessage);
  } catch (error: any) {
    console.error('Error submitting message:', error);
    res.status(500).json({ error: 'Failed to submit message' });
  }
};

// List all messages (admin)
export const listMessages = async (req: Request, res: Response) => {
  try {
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(messages);
  } catch (error: any) {
    console.error('Error listing messages:', error);
    res.status(500).json({ error: 'Failed to list messages' });
  }
};

// Mark a message as read (admin)
export const markAsRead = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const updated = await prisma.message.update({
      where: { id },
      data: { status: 'read' }
    });
    res.json(updated);
  } catch (error: any) {
    console.error('Error marking message as read:', error);
    res.status(500).json({ error: 'Failed to mark as read' });
  }
};

// Delete a message (admin)
export const deleteMessage = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await prisma.message.delete({ where: { id } });
    res.json({ message: 'Message deleted' });
  } catch (error: any) {
    console.error('Error deleting message:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
};

// Reply to a message
export const replyToMessage = async (req: Request, res: Response) => {
  try {
    const messageId = Number(req.params.id);
    const { reply } = req.body;

    // Find the original message
    const message = await prisma.message.findUnique({ where: { id: messageId } });
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Send reply via email
    await transporter.sendMail({
      from: process.env.NOTIFY_EMAIL,
      to: message.email,
      subject: `Reply: ${message.subject}`,
      text: reply,
    });

    res.json({ success: true, message: 'Reply sent' });
  } catch (error: any) {
    console.error('Error sending reply:', error);
    res.status(500).json({ error: 'Failed to send reply' });
  }
}; 