import mongoose from 'mongoose';

const planSchema = new mongoose.Schema(
  {
    client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    trainer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    active: { type: Boolean, default: true },
    schedule: {
      type: Map,
      of: [
        {
          id: String,
          name: String,
          sets: Number,
          reps: String,
          rpe: Number,
          notes: String
        }
      ]
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.model('Plan', planSchema);
