// import nodemailer from 'nodemailer';

// // Configuration du transporteur
// const transporter = nodemailer.createTransport({
//   service: 'gmail', // ou un autre service
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASSWORD,
//   },
// });

// interface EmailOptions {
//   to: string;
//   subject: string;
//   html: string;
// }

// export async function sendEmail(options: EmailOptions) {
//   try {
//     const mailOptions = {
//       from: `"École Secondaire" <${process.env.EMAIL_USER}>`,
//       ...options,
//     };

//     await transporter.sendMail(mailOptions);
//     console.log('Email sent successfully');
//   } catch (error) {
//     console.error('Error sending email:', error);
//     throw new Error('Failed to send email');
//   }
// }

// // Fonction spécifique pour les paiements
// export async function sendPaymentConfirmationEmail(
//   parentEmail: string,
//   studentName: string,
//   paymentDetails: {
//     amount: number;
//     feeType: string;
//     paymentType: string;
//     date: string;
//     description?: string;
//     balance: number;
//   }
// ) {
//   const subject = `Confirmation de paiement pour ${studentName}`;
  
//   const html = `
//     <!DOCTYPE html>
//     <html>
    // <head>
    //   <style>
    //     body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    //     .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    //     .content { padding: 20px; background-color: #f9fafb; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; }
    //     .detail { margin-bottom: 15px; }
    //     .label { font-weight: bold; color: #4b5563; }
    //     .amount { font-size: 24px; font-weight: bold; color: #059669; margin: 20px 0; }
    //     .footer { margin-top: 30px; font-size: 12px; color: #6b7280; text-align: center; }
    //     .button { display: inline-block; padding: 10px 20px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
    //   </style>
    // </head>
    // <body>
    //   <div class="header">
    //     <h1>Confirmation de Paiement</h1>
    //   </div>
    //   <div class="content">
    //     <p>Cher parent,</p>
    //     <p>Nous vous confirmons la réception du paiement pour <strong>${studentName}</strong>.</p>
        
    //     <div class="amount">${paymentDetails.amount.toLocaleString()} CDF</div>
        
    //     <div class="detail">
    //       <span class="label">Type de frais:</span> ${paymentDetails.feeType}
    //     </div>
    //     <div class="detail">
    //       <span class="label">Méthode de paiement:</span> ${paymentDetails.paymentType}
    //     </div>
    //     <div class="detail">
    //       <span class="label">Date:</span> ${new Date(paymentDetails.date).toLocaleDateString()}
    //     </div>
    //     ${paymentDetails.description ? `
    //     <div class="detail">
    //       <span class="label">Description:</span> ${paymentDetails.description}
    //     </div>
    //     ` : ''}
    //     <div class="detail">
    //       <span class="label">Solde restant:</span> ${paymentDetails.balance.toLocaleString()} CDF
    //     </div>
        
    //     <p>Vous pouvez consulter les détails complets dans votre espace parent sur notre plateforme.</p>
        
    //     <div class="footer">
    //       <p>Cet email est envoyé automatiquement, merci de ne pas y répondre.</p>
    //       <p>© ${new Date().getFullYear()} École Secondaire. Tous droits réservés.</p>
    //     </div>
    //   </div>
    // </body>
//     </html>
//   `;

//   await sendEmail({
//     to: parentEmail,
//     subject,
//     html,
//   });
// }
// /lib/mailer.ts
export async function sendPaymentConfirmationEmail(
  parentEmail: string,
  studentName: string,
  paymentDetails: {
    amount: number;
    feeType: string;
    paymentType: string;
    date: string;
    description?: string;
    balance: number;
  }
) {
  const subject = `Confirmation de paiement pour ${studentName}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <!-- Votre template HTML existant -->
     <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { padding: 20px; background-color: #f9fafb; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; }
        .detail { margin-bottom: 15px; }
        .label { font-weight: bold; color: #4b5563; }
        .amount { font-size: 24px; font-weight: bold; color: #059669; margin: 20px 0; }
        .footer { margin-top: 30px; font-size: 12px; color: #6b7280; text-align: center; }
        .button { display: inline-block; padding: 10px 20px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="header">
       <div class="logo-container">
<img src="https://i.ibb.co/jPDkJHzC/grandeur.webp" alt="grandeur" border="0" />
    </div>
        <h1>Confirmation de Paiement - La Grandeur</h1>
      </div>
      <div class="content">
        <p>Cher parent,</p>
        
        <p>Nous vous confirmons la réception du paiement pour <strong>${studentName}</strong>.</p>
        
        <div class="amount">${paymentDetails.amount.toLocaleString()} CDF</div>
        
        <div class="detail">
          <span class="label">Type de frais:</span> ${paymentDetails.feeType}
        </div>
        <div class="detail">
          <span class="label">Méthode de paiement:</span> ${paymentDetails.paymentType}
        </div>
        <div class="detail">
          <span class="label">Date:</span> ${new Date(paymentDetails.date).toLocaleDateString()}
        </div>
        ${paymentDetails.description ? `
        <div class="detail">
          <span class="label">Description:</span> ${paymentDetails.description}
        </div>
        ` : ''}
        <div class="detail">
          <span class="label">Solde restant:</span> ${paymentDetails.balance.toLocaleString()} CDF
        </div>
        
        <p>Vous pouvez consulter les détails complets dans votre espace parent sur notre plateforme.</p>
        
        <div class="footer">
          <p>Cet email est envoyé automatiquement, merci de ne pas y répondre.</p>
          <p>© ${new Date().getFullYear()} École Secondaire. Tous droits réservés.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: parentEmail,
        subject,
        html,
        parentEmail,
        studentName,
        paymentDetails
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send email');
    }

    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}
