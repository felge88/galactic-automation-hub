import { Router } from 'express';
import { getUsers, createUser, updateUser, deleteUser } from '../controllers/userController';
import { authenticateJWT, requireRole } from '../middlewares/authMiddleware';

const router = Router();

router.use(authenticateJWT);
router.use(requireRole(['ADMIN', 'ADMIRAL']));

router.get('/users', getUsers);
router.post('/users/create', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

export default router; 