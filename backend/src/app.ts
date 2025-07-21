import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import moduleRoutes from './routes/module';
import apikeyRoutes from './routes/apikey';
import instagramRoutes from './routes/instagram';
import youtubeRoutes from './routes/youtube';
import statsRoutes from './routes/stats';
import profileRoutes from './routes/profile';
import systemRoutes from './routes/system';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minuten
  max: 100, // max. 100 Requests pro IP
  standardHeaders: true,
  legacyHeaders: false,
}));
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', moduleRoutes);
app.use('/api', apikeyRoutes);
app.use('/api', instagramRoutes);
app.use('/api', youtubeRoutes);
app.use('/api', statsRoutes);
app.use('/api', profileRoutes);
app.use('/api', systemRoutes);

// Beispielroute
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

export default app; 