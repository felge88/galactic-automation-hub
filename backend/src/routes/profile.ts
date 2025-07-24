import { Router } from 'express';
import { updateProfile, updatePassword, updateTheme } from '../controllers/profileController';
import { authenticateJWT } from '../middlewares/authMiddleware';

const router = Router();

// Try to import multer, fallback if not available
let upload: any = null;
try {
  const multer = require('multer');
  upload = multer({ dest: 'uploads/avatars/' });
} catch (error) {
  console.warn('Multer not available, avatar upload disabled');
}

router.use(authenticateJWT);

router.put('/user/profile', updateProfile);
router.put('/user/password', updatePassword);
router.patch('/user/theme', updateTheme);

// Avatar upload with fallback
if (upload) {
  router.post('/user/avatar', upload.single('avatar'), (req, res) => {
    const file = (req as any).file;
    if (!file) return res.status(400).json({ error: 'Keine Datei hochgeladen' });
    res.json({ success: true, filename: file.filename, originalname: file.originalname });
  });
} else {
  router.post('/user/avatar', (req, res) => {
    res.status(501).json({ error: 'Avatar upload derzeit nicht verfügbar' });
  });
}

export default router; 