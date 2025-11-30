import mongoose from 'mongoose';

const logSchema = new mongoose.Schema(
  {
    client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    day: String,
    completed: { type: Boolean, default: false },
    volume: { type: Number, default: 0 },
    exercises: [
      {
        name: String,
        sets: [
          {
            weight: Number,
            reps: Number,
            rpe: Number
          }
        ]
      }
    ],
    notes: String
  },
  { timestamps: true }
);

export default mongoose.model('Log', logSchema);
