'use server';

import { signIn, signOut } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { AuthError } from 'next-auth';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rollNumber: z.string().optional(),
  branch: z.string().optional(),
  year: z.string().optional(),
  hostel: z.string().optional(),
  phone: z.string().optional(),
});

export async function registerAction(_prevState: unknown, formData: FormData) {
  try {
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      rollNumber: (formData.get('rollNumber') as string) || undefined,
      branch: (formData.get('branch') as string) || undefined,
      year: (formData.get('year') as string) || undefined,
      hostel: (formData.get('hostel') as string) || undefined,
      phone: (formData.get('phone') as string) || undefined,
    };

    const validated = registerSchema.parse(data);
    await dbConnect();

    const existing = await User.findOne({ email: validated.email.toLowerCase() });
    if (existing) return { error: 'Email already registered' };

    const domain = process.env.COLLEGE_EMAIL_DOMAIN || 'outr.ac.in';
    const isCollegeEmail = validated.email.toLowerCase().endsWith(`@${domain}`);

    const passwordHash = await bcrypt.hash(validated.password, 12);
    await new User({
      ...validated,
      email: validated.email.toLowerCase(),
      passwordHash,
      verified: false,
      idVerificationStatus:'none',
    }).save();

    await signIn('credentials', {
      email: validated.email,
      password: validated.password,
      redirectTo: '/dashboard',
    });
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) return { error: error.message };
    if (error instanceof AuthError) return { error: 'Authentication failed' };
    return { error: 'Something went wrong' };
  }
}


export async function loginAction(_prevState: unknown, formData: FormData) {
  try {
    await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirectTo: '/dashboard',
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) return { error: 'Invalid email or password' };
    throw error;
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: '/' });
}