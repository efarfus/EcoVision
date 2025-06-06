import express from 'express';
import * as usersController from '../controllers/user-controller';
import { verifyToken } from '../middleware/token-validation-middleware';

const{ check } = require('express-validator')

const router = express.Router();

router.get('/users', usersController.getUsers);
router.get('/user/token', usersController.getUserWithToken)
router.get('/user/email', usersController.getUserIdByEmail)
router.get('/user/:id', usersController.getUserById)

router.post('/signup', [
  check('email').not().isEmpty().isEmail().normalizeEmail(),
  check('password').isLength({ min: 6 })
], usersController.signupByEmail);

router.post('/login', [
  check('email').not().isEmpty().isEmail().normalizeEmail(),
  check('password').isLength({ min: 6 })
], usersController.login);

router.put('/user/update', usersController.updateUser)

router.delete('/user/:userId/delete', usersController.deleteUser)

export default router;