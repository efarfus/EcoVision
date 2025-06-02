import express from 'express';
import * as favoriteController from '../controllers/favorite-controller';
import { verifyToken } from '../middleware/token-validation-middleware';

const router = express.Router();

router.get('/getAllCoordinates', favoriteController.getAllFavoritedCoordinates);
router.get('/getCoordinate/:id', favoriteController.getCoordinate)

router.post('/addFavorite', favoriteController.addFavoriteCoordinate);

router.delete('/favoriteCoordinate/:id/delete', favoriteController.deleteFvorite)

export default router;