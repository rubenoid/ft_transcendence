import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Logger, Req, UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';

@WebSocketGateway()
export class GameGateway {

	@WebSocketServer() server: Server;
	constructor(private gameService: GameService) {}

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
		
	@SubscribeMessage('positionUpdate')
	handleMessage(client: any, payload: any): any {
	
	}
}
