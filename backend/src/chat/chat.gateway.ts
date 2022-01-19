import {
	SubscribeMessage,
	WebSocketGateway,
	OnGatewayInit,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Socket, Server,  } from "socket.io";
//import { ChatService, IncomingChatMessage } from './chat.service';
import { Logger, UseGuards } from "@nestjs/common";
import { GuardedSocket } from "src/overloaded";
import { JwtAuthGuard } from "../auth/jwt.guard";
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: { origin: "*" } })
export class ChatGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer() server: Server;

	constructor(private chatService: ChatService) {}

	private logger: Logger = new Logger("ChatGateway");

	afterInit(server: Server): void {
		this.logger.log("Init");
	}

	handleDisconnect(client: Socket): void {
		this.logger.log(`Chat::Client disconnected: ${client.id}`);
		this.chatService.handleDisconnect(client);
	}

	handleConnection(client: Socket, ...args: string[]): void {
		this.logger.log(`Chat::Client connected: ${client.id}`);
	}

	@UseGuards(JwtAuthGuard)
	@SubscribeMessage("userConnect")
	userConnect(client: GuardedSocket) {
		this.chatService.handleConnect(client);
	}

}
