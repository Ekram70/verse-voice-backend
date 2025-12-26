import Favorite from '../models/favoriteModel.mjs';

export const addFavorite = async (req, res) => {
  try {
    const existing = await Favorite.findOne({
      user: req.user.id,
      blog: req.params.blogId,
    });

    if (existing) {
      return res.status(400).json({ message: 'Already in favorites' });
    }

    const favorite = new Favorite({
      user: req.user.id,
      blog: req.params.blogId,
    });

    await favorite.save();
    res.status(201).json({ message: 'Added to favorites' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const removeFavorite = async (req, res) => {
  try {
    const result = await Favorite.findOneAndDelete({
      user: req.user.id,
      blog: req.params.blogId,
    });

    if (!result) {
      return res.status(404).json({ message: 'Favorite not found' });
    }

    res.json({ message: 'Removed from favorites' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user.id })
      .populate('blog')
      .sort({ createdAt: -1 });

    res.json(favorites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const checkFavorite = async (req, res) => {
  try {
    const exists = await Favorite.findOne({
      user: req.user.id,
      blog: req.params.blogId,
    });

    res.json({ isFavorited: !!exists });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getFavoriteCount = async (req, res) => {
  try {
    const count = await Favorite.countDocuments({ blog: req.params.blogId });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllFavoriteCounts = async (req, res) => {
  try {
    const results = await Favorite.aggregate([
      { $group: { _id: '$blog', count: { $sum: 1 } } },
    ]);

    const countsMap = {};
    results.forEach((r) => {
      countsMap[r._id.toString()] = r.count;
    });

    res.json(countsMap);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getFavoritedUsers = async (req, res) => {
  try {
    const favorites = await Favorite.find({ blog: req.params.blogId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    const users = favorites.map((f) => ({
      _id: f.user._id,
      name: f.user.name,
      avatar: f.user.avatar,
      favoritedAt: f.createdAt,
    }));

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
