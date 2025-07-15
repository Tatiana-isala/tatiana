import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function POST(request: Request) {
  try {
    const { recipients, subject, html, senderId } = await request.json();

    if (!Array.isArray(recipients) ){
      return NextResponse.json(
        { error: 'Recipients must be an array' },
        { status: 400 }
      );
    }

    // Envoyer à chaque destinataire individuellement
    const sendPromises = recipients.map(async (to) => {
      if (!to) return;
      
      await transporter.sendMail({
        from: `"École Secondaire" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
      });
    });

    await Promise.all(sendPromises);

    return NextResponse.json({ 
      success: true,
      message: `Email envoyé à ${recipients.length} destinataires`
    });
  } catch (error) {
    console.error('Error sending bulk email:', error);
    return NextResponse.json(
      { error: 'Failed to send bulk email' },
      { status: 500 }
    );
  }
}