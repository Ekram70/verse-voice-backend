import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    avatar: { type: String, default: '' },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minLength: [3, 'Name must be at least 3 characters'],
      maxLength: [24, 'Name must be maximum 24 characters'],
      match: [/^[a-zA-Z\s]*$/, 'Only letters and spaces allowed'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: [true, 'This email is already associated with another account'],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Not a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minLength: [8, 'Password should be at least 8 characters'],
      match: [
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*?[0-9])(?=.*?[!@#\$&*~]).{8,}$/,
        'Not a valid password',
      ],
    },
    blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    isSuperUser: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

const User = mongoose.model('User', userSchema);

export default User;
