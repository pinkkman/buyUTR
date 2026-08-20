import mongoose, { Schema, Document } from 'mongoose';

export interface IOffer extends Document {
  listing: mongoose.Types.ObjectId;
  buyer: mongoose.Types.ObjectId;
  seller: mongoose.Types.ObjectId;
  originalPrice: number;
  offeredPrice: number;
  message?: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COUNTERED' | 'CANCELLED' | 'EXPIRED';
  createdAt: Date;
  updatedAt: Date;
}

const OfferSchema = new Schema<IOffer>(
  {
    listing: { type: Schema.Types.ObjectId, ref: 'Listing', required: true },
    buyer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    seller: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    originalPrice: { type: Number, required: true },
    offeredPrice: { type: Number, required: true, min: 0 },
    message: { type: String },
    status: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'COUNTERED', 'CANCELLED', 'EXPIRED'],
      default: 'PENDING',
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Offer || mongoose.model<IOffer>('Offer', OfferSchema);