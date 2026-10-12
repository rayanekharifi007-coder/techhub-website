import nodemailer from "nodemailer";

const DEFAULT_RECEIVER = "emsi.techhub@gmail.com";

function getTransporter() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

export async function sendJoinApplicationEmail(input: {
  fullName: string;
  email: string;
  background: string;
  motivation: string;
}) {
  const transporter = getTransporter();
  if (!transporter) {
    throw new Error("Missing Gmail credentials. Set GMAIL_USER and GMAIL_APP_PASSWORD.");
  }

  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: process.env.TECHHUB_RECEIVER_EMAIL || DEFAULT_RECEIVER,
    replyTo: input.email,
    subject: `New TechHub Join Application — ${input.fullName}`,
    text: `New membership application\n\nFull name: ${input.fullName}\nEmail: ${input.email}\n\nTechnical background:\n${input.background}\n\nMotivation:\n${input.motivation}`,
  });
}

export async function sendContactEmail(input: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const transporter = getTransporter();
  if (!transporter) {
    throw new Error("Missing Gmail credentials. Set GMAIL_USER and GMAIL_APP_PASSWORD.");
  }

  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: process.env.TECHHUB_RECEIVER_EMAIL || DEFAULT_RECEIVER,
    replyTo: input.email,
    subject: `Contact Form — ${input.subject}`,
    text: `New contact message\n\nName: ${input.name}\nEmail: ${input.email}\nSubject: ${input.subject}\n\nMessage:\n${input.message}`,
  });
}
