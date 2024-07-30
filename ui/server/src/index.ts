import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';

import routes from './routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connect', (socket: Socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// appended all routes with api/
app.use(routes);

app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'backend working' });
});

if (process.env.NODE_ENV === 'production') {
  const CLIENT_BUILD_PATH = path.join(__dirname, '../../client/build');
  app.use(express.static(CLIENT_BUILD_PATH));
  app.get('*', (_req: Request, res: Response) =>
    res.sendFile(path.join(CLIENT_BUILD_PATH, 'index.html'))
  );
}

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
