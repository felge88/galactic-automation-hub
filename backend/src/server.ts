import app from './app';
import { createServer } from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

const httpServer = createServer(app);
const PORT = process.env.PORT || 4000;

// Socket.io Setup
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// JWT-Auth für Socket.io
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('Kein Token'));
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    (socket as any).user = decoded;
    next();
  } catch {
    next(new Error('Ungültiges Token'));
  }
});

// Beispiel-Namespace für Realtime-Features
const realtime = io.of('/realtime');
realtime.on('connection', (socket) => {
  // Hier können später Events für Module, Notifications etc. ergänzt werden
  socket.emit('welcome', { msg: 'Verbunden mit Realtime-API!' });
});

httpServer.listen(PORT, () => {
  console.log(`🚀 Server läuft auf http://localhost:${PORT}`);
  console.log(`🔌 Socket.io aktiv auf Port ${PORT}`);
}); 