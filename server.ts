// backend/server.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { TransactionalEmailsApi, SendSmtpEmail } from '@getbrevo/brevo';

dotenv.config();

const app = express();

app.use(cors({
    origin: ['https://www.namastebitcoin.com/'],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
}));
app.use(express.json());
const apiKey = process.env.BREVO_API_KEY!;
const apiInstance = new TransactionalEmailsApi();
apiInstance.setApiKey(0, apiKey);

app.post('/api/register', async (req, res) => {
  const { email, phone, name } = req.body;

  const emailData: SendSmtpEmail = {
    to: [{ email, name: email }],
    sender: { email: 'care@getbit.in', name: 'GetBIT' },
    subject: "Looking forward to seeing you at Namaste Bitcoin, " + name,
    htmlContent: `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; color: #222; background: #fff; padding: 32px; border-radius: 8px; max-width: 600px; margin: auto;">
                <p style="font-size: 1.1em;">Hi <strong>${name}</strong>,</p>
                <p>
                    Thanks for signing up early for <span style="color: #f7931a;">Namaste Bitcoin</span> — India’s first <strong>Bitcoin-only gathering</strong>, happening on <strong>January 8–9, 2026</strong>.
                </p>
                <p>
                    You’re on our <strong>early access list</strong>. That means you’ll be among the first to receive a link to purchase your ticket at a symbolic price of <span style="color: #f7931a;">₹21</span>. It’s our way of saying thank you for supporting this movement from the start.
                </p>
                <p>
                    This will be a focused 2-day event centered around <strong>Bitcoin, sound money, and open conversations</strong> — no distractions, no crypto noise.
                </p>
                <p>
                    We’ll email you the payment link once registrations open. The <span style="color: #f7931a;">₹21</span> ticket will only be available for a short window.
                </p>
                <p style="margin-top: 2em;">
                    Warm regards,<br>
                    <strong>Team Namaste Bitcoin</strong>
                </p>
                <hr style="margin: 2em 0;">
                <p style="font-style: italic; color: #888; text-align: center;">
                    Where Indian Wisdom Meets The Global Technology!
                </p>
                </div>
    `,
  };

   try {
    await apiInstance.sendTransacEmail(emailData);
    res.status(200).json({ message: 'Registration successful, sent mail' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send email' });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});