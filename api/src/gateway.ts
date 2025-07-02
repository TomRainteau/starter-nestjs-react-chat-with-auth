import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UsersService } from './users/users.service';
import { Message } from './messages/entities/message.entity';
import { MessagesService } from './messages/messages.service';
@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers: Map<string, string> = new Map();

  constructor(
    private readonly usersService: UsersService,
    private readonly messagesService: MessagesService,
  ) {}

  async handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;

    if (userId) {
      this.connectedUsers.set(client.id, userId);
      await this.usersService.updateLastSeen(userId);
      this.emitClientList();
      console.log(`Connexion : ${userId} (socket: ${client.id})`);
    } else {
      console.warn(`Connexion sans userId : ${client.id}`);
    }
  }

  async handleDisconnect(client: Socket) {
    const userId = this.connectedUsers.get(client.id);
    if (userId) {
      this.connectedUsers.delete(client.id);
      await this.usersService.updateLastSeen(userId);
      this.emitClientList();
      console.log(`Déconnexion : ${userId} (socket: ${client.id})`);
    }
  }

  @SubscribeMessage('newClickFromClient')
  handleMessage(client: Socket, payload: string) {
    console.log(client.id, payload);
    this.server.emit('newClickFromServer', 'One user click to the button');
  }

  private async emitClientList() {
    const userIds = Array.from(this.connectedUsers.values());
    const users = await Promise.all(
      userIds.map((id) => this.usersService.findOne(id)),
    );
    this.server.emit('clientListFromServer', users);
  }

  @SubscribeMessage('likeMessage')
  async handleLikeMessage(
    @MessageBody() messageId: string,
    @ConnectedSocket() client: Socket,
  ) {
    const updated = await this.messagesService.likeMessage(messageId);
    this.server.emit('messageLiked', updated);
  }
}
