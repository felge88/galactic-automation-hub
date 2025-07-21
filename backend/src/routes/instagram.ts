import { Router } from 'express';
import { addAccount, getStats, getPosts, generateContent, updateProxy } from '../controllers/instagramController';
import { authenticateJWT } from '../middlewares/authMiddleware';

const router = Router();

router.use(authenticateJWT);

router.post('/instagram/account', addAccount);
router.get('/instagram/stats', getStats);
router.get('/instagram/posts', getPosts);
router.post('/instagram/generate', generateContent);
router.patch('/instagram/proxy', updateProxy);

export default router; 