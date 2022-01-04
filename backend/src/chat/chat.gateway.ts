
import {
	SubscribeMessage,
	WebSocketGateway,
	OnGatewayInit,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
//import { ChatService, IncomingChatMessage } from './chat.service';
import { Logger } from '@nestjs/common';
// import { ChatMessage } from './chat.entity';


@WebSocketGateway({cors: {origin: '*'}})
export class ChatGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() server: Server;
	constructor() {}

	private logger: Logger = new Logger('ChatGateway');

	afterInit(server: Server) {
		this.logger.log('Init');
	}
	
	handleDisconnect(client: Socket) {
		this.logger.log(`Chat::Client disconnected: ${client.id}`);
	}
	
	handleConnection(client: Socket, ...args: any[]) {
		this.logger.log(`Chat::Client connected: ${client.id}`);
	}

	@SubscribeMessage('message')
  		handleMessage(client: any, payload: any): string {
			this.server.emit("message", "hallo terug")
    	return 'Hello world!';
  	}

}

