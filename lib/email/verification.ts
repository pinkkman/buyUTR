import { resend, FROM_EMAIL } from './resend';

export async function sendVerificationEmail(
  email: string,
  name: string,
  status: 'verified' | 'rejected',
  reason: string
) {
  const subject =
    status === 'verified'
      ? '✅ Your OUTR ID has been verified — welcome!'
      : '❌ Your ID could not be verified';

  const body =
    status === 'verified'
      ? `Hi ${name},\n\nGreat news — your OUTR university ID has been verified. You now have full access to OUTR Market.\n\nHappy trading!\n— The OUTR Market Team`
      : `Hi ${name},\n\nWe couldn't verify your university ID. Here's why:\n\n"${reason}"\n\nPlease re-submit a clearer photo of your ID at /verify-id.\n\n— The OUTR Market Team`;

  try {
    await resend.emails.send({ from: FROM_EMAIL, to: email, subject, text: body });
  } catch (err) {
    console.error('Email send failed:', err);
  }
}