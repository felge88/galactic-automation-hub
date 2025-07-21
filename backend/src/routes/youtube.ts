import { Router } from 'express';
import { downloadVideo, getHistory } from '../controllers/youtubeController';
import { authenticateJWT } from '../middlewares/authMiddleware';

const router = Router();

router.use(authenticateJWT);

router.post('/youtube/download', downloadVideo);
router.get('/youtube/history', getHistory);

export default router; 