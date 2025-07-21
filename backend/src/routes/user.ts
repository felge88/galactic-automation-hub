import { Router } from 'express';
import { getUsers, createUser, updateUser, deleteUser, getCurrentUser } from '../controllers/userController';
import { authenticateJWT, requireRole } from '../middlewares/authMiddleware';

const router = Router();

// Get current user
router.get('/user/me', authenticateJWT, getCurrentUser);

// Admin only routes
router.get('/users', authenticateJWT, requireRole(['ADMIN', 'ADMIRAL']), getUsers);
router.post('/users', authenticateJWT, requireRole(['ADMIN', 'ADMIRAL']), createUser);
router.put('/users/:id', authenticateJWT, requireRole(['ADMIN', 'ADMIRAL']), updateUser);
router.delete('/users/:id', authenticateJWT, requireRole(['ADMIN', 'ADMIRAL']), deleteUser);

export default router; 