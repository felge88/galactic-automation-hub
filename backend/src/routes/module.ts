import { Router } from 'express';
import { getModules, startStopModule, updateModuleSettings } from '../controllers/moduleController';
import { authenticateJWT } from '../middlewares/authMiddleware';

const router = Router();

router.use(authenticateJWT);

router.get('/modules', getModules);
router.put('/modules/:id/start-stop', startStopModule);
router.patch('/modules/:id/settings', updateModuleSettings);

export default router; 