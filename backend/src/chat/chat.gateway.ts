import {
	SubscribeMessage,
	WebSocketGateway,
	OnGatewayInit,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
//import { ChatService, IncomingChatMessage } from './chat.service';
import { Logger } from "@nestjs/common";
import { GuardedSocket } from "src/overloaded";
// import { ChatMessage } from './chat.entity';

@WebSocketGateway({ cors: { origin: "*" } })
export class ChatGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer() server: Server;

	private logger: Logger = new Logger("ChatGateway");

	afterInit(server: Server): void {
		this.logger.log("Init");
	}

	handleDisconnect(client: Socket): void {
		this.logger.log(`Chat::Client disconnected: ${client.id}`);
	}

	handleConnection(client: Socket, ...args: string[]): void {
		this.logger.log(`Chat::Client connected: ${client.id}`);
	}

	@SubscribeMessage("message")
	handleMessage(client: Socket, payload: string): string {
		this.server.emit("message", "hallo terug");
		return "Hello world!";
	}
}
