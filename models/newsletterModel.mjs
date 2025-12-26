import mongoose from 'mongoose';

const newsletterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    subscribedAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

const Newsletter = mongoose.model('Newsletter', newsletterSchema);
export default Newsletter;
