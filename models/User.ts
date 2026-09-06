import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  phone?: string;
  passwordHash?: string;
  avatar?: string;
  rollNumber?: string;
  branch?: string;
  year?: string;
  hostel?: string;
  bio?: string;
  role: 'USER' | 'MODERATOR' | 'ADMIN';
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
  idCardUrl?: string;
  idVerificationStatus: 'none' | 'pending' | 'verified' | 'rejected';
  idVerificationReason?: string;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  phone: { type: String },
  passwordHash: { type: String },
  avatar: { type: String },
  rollNumber: { type: String,unique: true, sparse: true  },
  branch: { type: String },
  year: { type: String },
  hostel: { type: String },
  bio: { type: String },
  role: { type: String, enum: ['USER', 'MODERATOR', 'ADMIN'], default: 'USER' },
  verified: { type: Boolean, default: false },
  idCardUrl: { type: String },
    idVerificationStatus: {
      type: String,
      enum: ['none', 'pending', 'verified', 'rejected'],
      default: 'none',
      index: true,
    },
    idVerificationReason: { type: String },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);