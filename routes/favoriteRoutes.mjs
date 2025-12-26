import express from 'express';
import {
  addFavorite,
  removeFavorite,
  getFavorites,
  checkFavorite,
  getFavoriteCount,
  getAllFavoriteCounts,
  getFavoritedUsers,
} from '../controllers/favoriteController.mjs';
import authenticateToken from '../middlewares/verifyToken.mjs';

const router = express.Router();

router.get('/', authenticateToken, getFavorites);
router.get('/counts', getAllFavoriteCounts);
router.get('/count/:blogId', getFavoriteCount);
router.get('/check/:blogId', authenticateToken, checkFavorite);
router.get('/users/:blogId', getFavoritedUsers);
router.post('/:blogId', authenticateToken, addFavorite);
router.delete('/:blogId', authenticateToken, removeFavorite);

export default router;
