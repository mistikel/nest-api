import { Schema } from 'mongoose';

export const ProductSchema = new Schema({
  name: { type: String, required: true },
  userId: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  warrantyPeriod: { type: Number, required: true },
});
