import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'your-email@gmail.com', // Replace with your SMTP credentials
    pass: 'your-app-password' // Replace with your SMTP password
  }
});

export const sendAppointmentEmail = async (appointmentData: {
  patient_name: string;
  email: string;
  phone: string;
  service: string;
  preferred_date: string;
  preferred_time: string;
  payment_reference: string;
  message?: string;
}) => {
  const emailContent = `
    New Appointment Request

    Patient Details:
    - Name: ${appointmentData.patient_name}
    - Email: ${appointmentData.email}
    - Phone: ${appointmentData.phone}

    Appointment Details:
    - Service: ${appointmentData.service}
    - Preferred Date: ${appointmentData.preferred_date}
    - Preferred Time: ${appointmentData.preferred_time}

    Payment Details:
    - Reference Number: ${appointmentData.payment_reference}

    Additional Message:
    ${appointmentData.message || 'No message provided'}
  `;

  try {
    await transporter.sendMail({
      from: '"Appointment System" <your-email@gmail.com>', // Replace with your email
      to: 'appointment@slimexpert.pk',
      subject: `New Appointment Request - ${appointmentData.patient_name}`,
      text: emailContent
    });
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send notification email');
  }
};