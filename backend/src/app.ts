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

// CORS-Konfiguration
const corsOptions = {
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(helmet({
  crossOriginEmbedderPolicy: false,
}));
app.use(morgan('dev'));

// Rate Limiting
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minuten
  max: 100, // max. 100 Requests pro IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Zu viele Anfragen, versuchen Sie es später erneut.' }
}));

// Routes
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', moduleRoutes);
app.use('/api', apikeyRoutes);
app.use('/api', instagramRoutes);
app.use('/api', youtubeRoutes);
app.use('/api', statsRoutes);
app.use('/api', profileRoutes);
app.use('/api', systemRoutes);

// Health Check
app.get('/api/health', (_req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// 404 Handler
app.use('*', (_req, res) => {
  res.status(404).json({ error: 'Route nicht gefunden' });
});

export default app; 