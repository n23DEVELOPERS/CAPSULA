import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(NotificationGateway.name);

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket): void {
    this.logger.log(` Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket): void {
    this.logger.warn(` Client disconnected: ${client.id}`);
  }

  sendNotificationToAdmins(notification: {
    title: string;
    message: string;
    doctorId?: number;
    time?: string;
  }): void {
    const payload = {
      ...notification,
      time: notification.time || new Date().toISOString(),
    };

    this.logger.debug(
      ` Adminlarga ariza xabari yuborildi: ${JSON.stringify(payload)}`,
    );
    this.server.emit('admin_notification', payload);
  }
}
