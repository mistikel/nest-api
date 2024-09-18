import { Schema, Types } from 'mongoose';

export const ClaimSchema = new Schema({
  product: { type: Types.ObjectId, ref: 'Product', required: true },
  userId: { type: String, required: true },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
