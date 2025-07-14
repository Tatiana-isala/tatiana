import { createBulkEmail, getParentsEmails, getTeachersEmails } from './db';
import { v4 as uuidv4 } from 'uuid';

export async function sendBulkEmail(
  recipientEmails: string[],
  subject: string,
  htmlContent: string,
  senderId: string
) {
  try {
    const response = await fetch('/api/send-bulk-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipients: recipientEmails,
        subject,
        html: htmlContent,
        senderId
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send bulk email');
    }

    // Déterminer le type de destinataires
    const allParentsEmails = await getParentsEmails();
    const allTeachersEmails = await getTeachersEmails();
    
    let recipientType: 'PARENTS' | 'TEACHERS' | 'SPECIFIC' = 'SPECIFIC';
    
    if (recipientEmails.length > 1) {
      if (recipientEmails.every(email => allParentsEmails.includes(email))) {
        recipientType = 'PARENTS';
      } else if (recipientEmails.every(email => allTeachersEmails.includes(email))) {
        recipientType = 'TEACHERS';
      }
    }

    // Enregistrer l'historique
    await createBulkEmail({
      id: uuidv4(),
      senderId,
      subject,
      content: htmlContent,
      recipientType,
      specificRecipients: recipientType === 'SPECIFIC' ? recipientEmails : undefined,
      createdAt: new Date().toISOString()
    });

    return await response.json();
  } catch (error) {
    console.error('Error sending bulk email:', error);
    throw error;
  }
}

export const bulkEmailTemplate = (content: string, senderName?: string, classroomName?: string) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { 
      background-color: #2563eb; 
      color: white; 
      padding: 20px; 
      text-align: center; 
      border-radius: 8px 8px 0 0; 
    }
    .logo-container {
      margin-bottom: 15px;
    }
    .logo {
      max-height: 80px;
      max-width: 100%;
    }
    .header-title {
      margin-top: 10px;
      margin-bottom: 5px;
    }
    .header-sub {
      font-size: 0.9em;
      opacity: 0.9;
    }
    .content { padding: 20px; background-color: #f9fafb; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; }
    .footer { margin-top: 30px; font-size: 12px; color: #6b7280; text-align: center; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo-container">
      <img src="https://i.postimg.cc/CxKYPGrB/Pngtree-school-logo-design-vector-9037661.png" alt="Logo École" class="logo">
    </div>
    <h1 class="header-title">École Secondaire Grandeur</h1>
    ${classroomName ? `<p class="header-sub">Pour les parents de ${classroomName}</p>` : ''}
  </div>
  <div class="content">
    ${content}
    ${senderName ? `<p>Envoyé par: <strong>${senderName}</strong></p>` : ''}
  </div>
  <div class="footer">
    <p>Cet email est envoyé automatiquement, merci de ne pas y répondre.</p>
    <p>© ${new Date().getFullYear()} École Secondaire Grandeur. Tous droits réservés.</p>
  </div>
</body>
</html> `;