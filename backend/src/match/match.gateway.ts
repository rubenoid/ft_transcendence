import { Logger, Req, UseGuards } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { MatchService } from './match.service';

@WebSocketGateway()
export class MatchGateway {
 
	@WebSocketServer() server: Server;
	constructor(private matchService: MatchService) {}

	private logger: Logger = new Logger('MatchGateway');

	afterInit(server: Server) {
		this.logger.log('Init');
	}
	
	handleDisconnect(client: Socket) {
		this.logger.log(`Match::Client disconnected: ${client.id}`);
	}
	
	handleConnection(client: Socket, ...args: any[]) {
		this.logger.log(`Match::Client connected: ${client.id}`);
	}	
	// async getme(@Req() req, @Param() param) {
	// 	return await this.userService.getUser(req.user.id as number);
	@UseGuards(JwtAuthGuard)
	@SubscribeMessage('addToQueue')
	handleMessage(client: Socket, payload: any): any {
		console.log("adding to queueueueueu!!client", client);
		this.matchService.addPlayerToQueue(client, this.server);
    // console.log("req.user as number", req.user);
		// this.matchService.addPlayerToQueue()
  }
}
