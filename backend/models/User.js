import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['trainer', 'client'], default: 'client' },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    trainer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', nullable: true },
    avatar: { type: String, default: '' },
    bio: { type: String, default: '' },
    notes: { type: String, default: '' },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    rank: { type: String, default: 'Recruit' },
    joined: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
