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

	handleDisconnect(client: GuardedSocket): void {
		this.logger.log(`Chat::Client disconnected: ${client.id}`);
	}

	handleConnection(client: GuardedSocket, ...args: string[]): void {
		this.logger.log(`Chat::Client connected: ${client.id}`);
	}

	@SubscribeMessage("chat:message")
	ThisFunctionNameDoesntMatter(client: GuardedSocket, payload: string): string {
		console.log(" Backend client.user:", client.user, "send message", payload);

		console.log("client.id:");
		console.log(client.id);
		console.log("<<<");
		
		
		client.emit("banaan:nieuw", "ook hallo");
		client.emit("banaan:delete", "delete it appie!!");
		return "hallo terug";
	}
}
