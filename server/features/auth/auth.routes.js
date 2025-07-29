import express from 'express';
import { registerUser, loginUser, logoutUser, refreshToken, getMe } from './auth.controller.js';
import { protect } from '../../middleware/auth.middleware.js';
import { body } from 'express-validator';

const router = express.Router();

router.post(
  '/signup',
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please include a valid email'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  registerUser
);

router.post(
  '/login',
  body('email').isEmail().withMessage('Please include a valid email'),
  body('password').exists().withMessage('Password is required'),
  loginUser
);

router.post('/logout', logoutUser);
router.post('/refresh-token', refreshToken);
router.get('/me', protect, getMe);

export default router;
