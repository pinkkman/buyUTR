import mongoose, { Schema, Document } from 'mongoose';

export interface IListing extends Document {
  title: string;
  description: string;
  price: number;
  category: string;
  subcategory?: string;
  condition: string;
  images: string[];
  location: string;
  seller: mongoose.Types.ObjectId;
  status: 'ACTIVE' | 'SOLD' | 'RESERVED' | 'EXPIRED' | 'REMOVED';
  views: number;
  tags: string[];
  negotiable: boolean;
  exchangeAvailable: boolean;
  rentalAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ListingSchema = new Schema<IListing>({
  title: { type: String, required: true, index: 'text' },
  description: { type: String, required: true, index: 'text' },
  price: { type: Number, required: true, sparse: 0 },
  category: { type: String, required: true, index: true },
  subcategory: { type: String },
  condition: { type: String, required: true },
  images: [{ type: String }],
  location: { type: String, required: true },
  seller: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  status: {
    type: String,
    enum: ['ACTIVE', 'SOLD', 'RESERVED', 'EXPIRED', 'REMOVED'],
    default: 'ACTIVE',
    index: true
  },
  views: { type: Number, default: 0 },
  tags: [{ type: String }],
  negotiable: { type: Boolean, default: false },
  exchangeAvailable: { type: Boolean, default: false },
  rentalAvailable: { type: Boolean, default: false },
}, { timestamps: true });

ListingSchema.index({ title: 'text', description: 'text', tags: 'text' });
export default mongoose.models.Listing || mongoose.model<IListing>('Listing', ListingSchema);