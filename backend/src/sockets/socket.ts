import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { logger } from '../config/logger';

let io: SocketIOServer | null = null;

export const initSocket = (httpServer: HTTPServer): SocketIOServer => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    logger.info(`🔌 Client connected to WebSocket: ${socket.id}`);

    socket.on('disconnect', () => {
      logger.info(`🔌 Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = (): SocketIOServer => {
  if (!io) {
    throw new Error('Socket.io has not been initialized!');
  }
  return io;
};

export const broadcastEvent = (event: string, data: any): void => {
  if (io) {
    io.emit(event, data);
    logger.info(`📢 WebSocket Broadcast: ${event}`);
  } else {
    logger.warn('Could not broadcast WebSocket event: Socket.io is not initialized.');
  }
};
