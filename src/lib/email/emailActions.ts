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

export async function sendPasswordResetEmail(userEmail: string, resetToken: string, tokenExpiryDate: string) {

   const resetLink = process.env.NEXT_PUBLIC_BASE_URL + "/auth/reset-password/" + resetToken;

   try {
      const mailOptions: Mail.Options = {
         from: 'noreply@sunbirdenglish.com',
         to: userEmail,
         subject: 'Password Reset Request',
         html: `
            <div>
               <div>
                  <p>Hi ${userEmail},</p>
                  <br/>
                  <p>We received a password reset request for your account on sunbirdenglish.com. 我们刚收到您的账户密码重置要求。 To proceed, please click the link below: 要继续，请点击以下的链接：</p>
                  <a href="${resetLink}">${resetLink}</a>
                  <p>If you didn't request for a password reset, you may ignore this email. Your password will remain unchanged. 若您没要求重置密码，可忽略此邮件。</p>
                  <p>For security reasons, this link will expire at ${DateTime.fromISO(tokenExpiryDate).toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY)}. If you require assistance, feel free to contact support at contact@sunbirdenglish.com. Please do not reply to this email.</p>
                  <br/>
               </div>
               <div>
                  <p>Best Regards,<br/>Sunbird English</p>
               </div>
            </div>
         `,
      };
      
      const res = await trans.sendMail(mailOptions);
      console.log(`User ${userEmail} requested for password reset. Email sent: ${res.response}`);
   } catch (error) {
      console.error("Error sending email: " + error);
   }
}

export async function sendResetPasswordUpdateEmail(userEmail: string) {
   try {
      const mailOptions: Mail.Options = {
         from: 'noreply@sunbirdenglish.com',
         to: userEmail,
         subject: 'Your Password Has Been Reset',
         html: `
            <div>
               <div>
                  <p>Hi ${userEmail},</p>
                  <br/>
                  <p>Your password for your sunbirdenglish.com account has just been changed. If this was intentional, you may ignore this email.</p>
                  <p>If you did not authorise this change, please contact us at contact@sunbirdenglish.com immediately to secure your account. Please do not reply to this email.</p>
                  <br/>
               </div>
               <div>
                  <p>Best Regards,<br/>Sunbird English</p>
               </div>
            </div>
         `,
      };
      
      const res = await trans.sendMail(mailOptions);
      console.log(`User ${userEmail} has just reset their password. Notification email sent: ${res.response}`);
   } catch (error) {
      console.error("Error sending email: " + error);
   }
};

export async function sendAccountRegisteredEmail(userEmail: string) {
   try {
      const mailOptions: Mail.Options = {
         from: 'noreply@sunbirdenglish.com',
         to: userEmail,
         subject: 'Welcome to Sunbird English',
         html: `
            <div>
               <div>
                  <p>Hi ${userEmail},</p>
                  <br/>
                  <p>Welcome to Sunbird English! Your account has been successfully created. You now have access to all our features.</p>
                  <p>If you require any assistance, feel free to contact us at contact@sunbirdenglish.com. Please do not reply to this email.</p>
               </div>
               <div>
                  <p>Best Regards,<br/>Sunbird English</p>
               </div>
            </div>
         `,
      };
      
      const res = await trans.sendMail(mailOptions);
      console.log(`${userEmail}'s account has been created. Notification email sent: ${res.response}`);
   } catch (error) {
      console.error("Error sending email: " + error);
   }
}