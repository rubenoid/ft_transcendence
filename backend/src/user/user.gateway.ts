import { UseGuards } from '@nestjs/common';
import { OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from "socket.io";
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { GuardedSocket } from "src/overloaded";
import { UserService } from './user.service';

@WebSocketGateway({ cors: { origin: "*" } })
export class UserGateway implements OnGatewayDisconnect {

  constructor (private userService: UserService) {}

	@WebSocketServer() server: Server;

	@UseGuards(JwtAuthGuard)
	handleDisconnect(client: GuardedSocket): void {
    this.userService.updateUserStatus(this.server, client, "Offline");
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('userConnect')
  userConnect(client: GuardedSocket, payload: any): string {
    this.userService.updateUserStatus(this.server, client, "Online");
    return 'Hello userConnect!';
  }

	@UseGuards(JwtAuthGuard)
  @SubscribeMessage('userInGame')
  userInGame(client: GuardedSocket, payload: any): string {
    this.userService.updateUserStatus(this.server, client, "In game");
    return 'Hello userInGame!';
  }

	@UseGuards(JwtAuthGuard)
  @SubscribeMessage('userOutGame')
  userOutGame(client: GuardedSocket, payload: any): string {
    this.userService.updateUserStatus(this.server, client, "Online");
    return'Hello userOutGame!';
  }
}
