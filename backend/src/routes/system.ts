import { Router } from 'express';
import { getStatus, setMaintenance, getLogs } from '../controllers/systemController';
import { authenticateJWT, requireRole } from '../middlewares/authMiddleware';

const router = Router();

router.use(authenticateJWT);
router.use(requireRole(['ADMIN', 'ADMIRAL']));

router.get('/system/status', getStatus);
router.patch('/system/maintenance', setMaintenance);
router.get('/system/logs', getLogs);

export default router; 