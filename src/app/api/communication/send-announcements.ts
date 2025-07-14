import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { to, subject, content } = req.body;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { padding: 20px; background-color: #f9fafb; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; }
          .footer { margin-top: 30px; font-size: 12px; color: #6b7280; text-align: center; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Annonce de l'École</h1>
        </div>
        <div class="content">
          <h2>${subject}</h2>
          <div>${content.replace(/\n/g, '<br>')}</div>
          <div class="footer">
            <p>Cet email vous a été envoyé car vous êtes parent d'un élève de notre établissement.</p>
            <p>© ${new Date().getFullYear()} École Secondaire. Tous droits réservés.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"École Secondaire" <${process.env.EMAIL_USER}>`,
      bcc: to, // Utilisation de BCC pour ne pas exposer les emails des autres parents
      subject: `[Annonce] ${subject}`,
      html,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending announcement:', error);
    res.status(500).json({ error: 'Failed to send announcement' });
  }
}