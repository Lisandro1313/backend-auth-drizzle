import express from 'express';
import { register, login, getMe } from '../controllers/authController';
import { verificarToken } from '../middleware/auth';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', verificarToken, getMe);

export default router;
