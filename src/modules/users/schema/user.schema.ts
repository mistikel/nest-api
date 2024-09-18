import { Schema } from 'mongoose';

export const UserSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'staff'], required: true },
});