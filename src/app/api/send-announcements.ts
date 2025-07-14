import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import { getAllUsers, getStudentByTutorId } from '@/lib/db';

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
    const { title, content } = req.body;

    // Récupérer tous les parents
    const parents = (await getAllUsers()).filter(u => u.role === 'parent');
    
    // Envoyer à chaque parent
    const results = await Promise.allSettled(parents.map(async parent => {
      // Récupérer les élèves de ce parent pour personnaliser le message
      const students = await getStudentByTutorId(parent.id);
      
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
            <h1>${title}</h1>
          </div>
          <div class="content">
            <p>Cher parent${students.length > 0 ? ` de ${students.map(s => s.prenom).join(', ')}` : ''},</p>
            <div>${content}</div>
            <p>Vous pouvez consulter cette annonce dans votre espace parent sur notre plateforme.</p>
            <div class="footer">
              <p>Cet email est envoyé automatiquement, merci de ne pas y répondre.</p>
              <p>© ${new Date().getFullYear()} École Secondaire. Tous droits réservés.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      await transporter.sendMail({
        from: `"École Secondaire" <${process.env.EMAIL_USER}>`,
        to: parent.email || '',
        subject: `Annonce: ${title}`,
        html,
      });
    }));

    res.status(200).json({ 
      success: true,
      sentCount: results.filter(r => r.status === 'fulfilled').length
    });
  } catch (error) {
    console.error('Error sending announcement:', error);
    res.status(500).json({ error: 'Failed to send announcement' });
  }
}