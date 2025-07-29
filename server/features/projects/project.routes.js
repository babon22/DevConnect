import express from 'express';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  createProjectComment,
  searchProjects,
} from './project.controller.js';
import { protect } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.route('/').get(getProjects).post(protect, createProject);
router.route('/search').get(searchProjects); // Must be before /:id
router.route('/:id').get(getProjectById).put(protect, updateProject).delete(protect, deleteProject);
router.route('/:id/comments').post(protect, createProjectComment);

export default router;