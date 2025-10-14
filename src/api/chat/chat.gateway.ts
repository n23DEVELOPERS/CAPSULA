import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';

@WebSocketGateway({ cors: true })
export class ChatGateway {
  @WebSocketServer() server: Server;

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('join_room')
  handleJoinRoom(
    @MessageBody() data: { doctor_id: number; patient_id: number },
    @ConnectedSocket() client: Socket,
  ) {
    const room = `room_${data.doctor_id}_${data.patient_id}`;
    client.join(room);
    console.log(`Client ${client.id} joined ${room}`);
  }

  @SubscribeMessage('send_message')
  async handleMessage(@MessageBody() dto: CreateChatDto) {
    const chat = await this.chatService.create(dto);
    const room = `room_${dto.doctor_id}_${dto.patient_id}`;
    this.server.to(room).emit('new_message', chat);
  }

  @SubscribeMessage('delete_message')
  async handleDelete(@MessageBody() data: { id: number }) {
    const deleted = await this.chatService.remove(data.id);
    this.server.emit('message_deleted', deleted);
  }
}
