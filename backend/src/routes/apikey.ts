import { Router } from 'express';
import { createApiKey } from '../controllers/apikeyController';
import { authenticateJWT } from '../middlewares/authMiddleware';

const router = Router();

router.use(authenticateJWT);

router.post('/apikeys', createApiKey);

export default router; 