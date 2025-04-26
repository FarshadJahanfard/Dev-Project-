export async function sendConfirmationEmail(toEmail, reservationDetails){
  try {
    const nodemailer = await import('nodemailer');

    const transporter = nodemailer.default.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.COMPANY_EMAIL,
        pass: process.env.COMPANY_EMAIL_PASSWORD,
      },
    });

    const template = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; color: #333333;">
      <div style="text-align: center; margin-bottom: 30px;">
        <img src="https://i.imgur.com/lj5XKGh.png" alt="ZenFlow Logo" style="width: 150px; height: auto;" />
      </div>

      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px; text-align: center;">
        <h1 style="color: #4a5568; font-size: 24px; margin: 0 0 10px 0;">Booking Confirmation</h1>
        <p style="font-size: 16px; margin: 0;">Thank you for your booking!</p>
      </div>

      <div style="margin-bottom: 20px;">
        <p style="font-size: 16px; line-height: 1.5;">Hello ${reservationDetails.name.trim()},</p>
        <p style="font-size: 16px; line-height: 1.5;">Your booking has been confirmed. Here are the details:</p>
      </div>

      <div style="border: 1px solid #e2e8f0; border-radius: 5px; padding: 20px; margin-bottom: 30px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tbody>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #4a5568;">Date:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">${new Date(reservationDetails.date).toLocaleDateString()}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #4a5568;">Time:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">${reservationDetails.time.split(" ")[1]}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #4a5568;">Number of Guests:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">${reservationDetails.guests}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #4a5568;">Reference:</td>
              <td style="padding: 10px 0;">${reservationDetails.reservationID}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style="margin-bottom: 30px;">
        <h2 style="font-size: 18px; color: #4a5568; margin-bottom: 10px;">What's Next?</h2>
        <p style="font-size: 16px; line-height: 1.5;">
          If you need to reschedule or cancel your booking, please contact us at least 24 hours in advance.
        </p>
      </div>

      <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; text-align: center; color: #718096; font-size: 14px;">
        <p>
          If you have any questions, please contact us via
          <a href="mailto:${process.env.COMPANY_EMAIL}" style="color: #3182ce; text-decoration: none;">email</a>
        </p>
        <p style="margin-top: 10px;">&copy; ${new Date().getFullYear()} ZenFlow. All rights reserved.</p>
      </div>
    </div>`;

    const mailOptions = {
      from: process.env.COMPANY_EMAIL,
      to: toEmail,
      subject: 'Your Reservation is Confirmed! - ZenFlow',
      text: `Hi!\n\nYour reservation is confirmed.\n\nDetails:\nDate: ${reservationDetails.date}\nTime: ${reservationDetails.time}\nTable: ${reservationDetails.table}\n\nThank you for choosing ZenFlow!`,
      html: template,
    };

    await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent!');
  } catch (error) {
    console.error('Error sending confirmation email:', error);
  }
}
