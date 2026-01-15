import mongoose from 'mongoose';

const pendingUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    },
  },
  { timestamps: true, versionKey: false }
);

// Auto-delete expired documents
pendingUserSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const PendingUser = mongoose.model('PendingUser', pendingUserSchema);

export default PendingUser;
