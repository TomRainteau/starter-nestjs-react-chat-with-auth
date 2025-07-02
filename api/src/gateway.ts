import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'http';
import { UsersService } from './users/users.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AppGateway {
  @WebSocketServer()
  server: Server;

  handleConnection() {
    console.log('Client connected');
  }

  @SubscribeMessage('newClickFromClient')
  handleMessage(client, payload: string) {
    console.log(client.id, payload);
    this.server.emit('newClickFromServer', 'One user click to the button');
  }
}
