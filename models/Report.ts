import mongoose, { Schema, Document } from 'mongoose';

export interface IReport extends Document {
  reporter: mongoose.Types.ObjectId;
  targetType: 'Listing' | 'User';
  targetId: mongoose.Types.ObjectId;
  reason: string;
  details?: string;
  status: 'PENDING' | 'INVESTIGATED' | 'DISMISSED' | 'ACTION_TAKEN';
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema = new Schema<IReport>(
  {
    reporter: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    targetType: { type: String, enum: ['Listing', 'User'], required: true },
    targetId: { type: Schema.Types.ObjectId, required: true },
    reason: { type: String, required: true },
    details: { type: String },
    status: {
      type: String,
      enum: ['PENDING', 'INVESTIGATED', 'DISMISSED', 'ACTION_TAKEN'],
      default: 'PENDING',
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Report || mongoose.model<IReport>('Report', ReportSchema);