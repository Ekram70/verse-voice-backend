import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema(
  {
    email: { type: String },
    otp: { type: String },
    status: { type: Number, default: 0 },
    createdOn: { type: Date, default: Date.now() },
  },
  { versionKey: false }
);

const otpModel = mongoose.model('otp', otpSchema);

export default otpModel;
