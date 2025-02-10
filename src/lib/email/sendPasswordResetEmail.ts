import { DateTime } from 'luxon';
import { createTransport } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

if (!process.env.NOREPLY_EMAIL_PASSWORD) {
   throw new Error("email password env variable not set");
}

const trans = createTransport({
   host: 'smtp.hostinger.com',
   port: 465,
   secure: true,
   auth: {
      user: 'noreply@sunbirdenglish.com',
      pass: process.env.NOREPLY_EMAIL_PASSWORD,
   }
})

export default async function sendPasswordResetEmail(userEmail: string, resetToken: string, tokenExpiryDate: string) {
   try {
      const mailOptions: Mail.Options = {
         from: 'noreply@sunbirdenglish.com',
         to: userEmail,
         subject: 'Reset Password',
         html: `
            <div>
               <p>Hello ${userEmail},</p>
               <br/>
               <p>We received a request to reset your password for your account. If you did not make this request, you can safely ignore this email.</p>
               <p>To reset your password, click the link below:</p>
               <a href="${resetToken}">${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password/${resetToken}</a>
               <p>This link will expire at ${DateTime.fromISO(tokenExpiryDate).toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY)} for security reasons. If you have any queries, feel free to contact support at contact@sunbirdenglish.com. Please do not reply to this email.</p>
               <br/>
            </div>
            <div>
               <p>Best Regards,<br/>Sunbird English</p>
            </div>
         `,
      };
      
      const res = await trans.sendMail(mailOptions);
      console.log("Email sent: " + res.response);
   } catch (error) {
      console.error("Error sending email: " + error);
   }
}