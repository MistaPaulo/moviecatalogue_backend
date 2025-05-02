import express from 'express';
import { signup, login, logout } from '../controllers/auth.controller.js';
import authenticateJWT from '../middleware/auth.jwt.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', authenticateJWT, logout);

export default router;
