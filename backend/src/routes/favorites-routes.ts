import express from 'express';
import * as favoriteController from '../controllers/favorite-controller';
import { verifyToken } from '../middleware/token-validation-middleware';

const router = express.Router();

router.get('/getAllCoordinates', verifyToken, favoriteController.getAllFavoritedCoordinates);
router.get('/getCoordinate/:id', verifyToken, favoriteController.getCoordinate)

router.post('/addFavorite', verifyToken, favoriteController.addFavoriteCoordinate);

router.delete('/favoriteCoordinate/:id/delete', verifyToken, favoriteController.deleteFvorite)

export default router;