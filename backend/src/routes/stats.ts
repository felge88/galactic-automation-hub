import { Router } from 'express';
import { getModuleStats } from '../controllers/statsController';
import { authenticateJWT } from '../middlewares/authMiddleware';

const router = Router();

router.use(authenticateJWT);

router.get('/stats/:module', getModuleStats);

export default router; 