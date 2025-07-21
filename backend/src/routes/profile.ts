import { Router } from 'express';
import { updateProfile, updatePassword, updateTheme } from '../controllers/profileController';
import { authenticateJWT } from '../middlewares/authMiddleware';
import multer from 'multer';

const router = Router();
const upload = multer({ dest: 'uploads/avatars/' });

router.use(authenticateJWT);

router.put('/user/profile', updateProfile);
router.put('/user/password', updatePassword);
router.patch('/user/theme', updateTheme);
router.post('/user/avatar', upload.single('avatar'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Keine Datei hochgeladen' });
  res.json({ success: true, filename: req.file.filename, originalname: req.file.originalname });
});

export default router; 