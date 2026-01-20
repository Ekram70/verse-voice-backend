import User from '../models/usersModel.mjs';

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('name avatar');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { name } = req.body;
    if (name !== undefined) user.name = name;

    // Handle avatar file upload
    if (req.files && req.files['avatar']) {
      const url = req.protocol + '://' + req.get('host');
      user.avatar = url + '/' + req.files['avatar'][0].filename;
    }

    await user.save();
    res.json({ name: user.name, avatar: user.avatar, email: user.email });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
