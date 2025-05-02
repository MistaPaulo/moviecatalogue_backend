import express from 'express';
import { getProfile, updateProfile } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/me', getProfile);
router.patch('/me', updateProfile);

export default router;
