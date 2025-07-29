import express from 'express';
import { getAllUsers, getUserById, updateUserProfile, searchUsers } from './user.controller.js';
import { protect } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.route('/').get(getAllUsers);
router.route('/profile').put(protect, updateUserProfile);
router.route('/search').get(searchUsers); // Must be before /:id
router.route('/:id').get(getUserById);

export default router;