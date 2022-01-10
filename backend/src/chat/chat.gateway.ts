import {
	SubscribeMessage,
	WebSocketGateway,
	OnGatewayInit,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt.guard";
//import { ChatService, IncomingChatMessage } from './chat.service';
import { Logger } from "@nestjs/common";
import { GuardedSocket } from "src/overloaded";
import { ChatService } from "./chat.service";
// import { ChatMessage } from './chat.entity';

@WebSocketGateway({ cors: { origin: "*" } })
export class ChatGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer() server: Server;
	constructor(private chatService: ChatService,
		) {}

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

	@UseGuards(JwtAuthGuard)
	@SubscribeMessage("chat:login")
	loginUser(client: GuardedSocket)
	{		
		this.chatService.addConnection(client.user.id, client.id)
	}

	@UseGuards(JwtAuthGuard)
	@SubscribeMessage("chat:message")
	ThisFunctionNameDoesntMatter(client: GuardedSocket, payload: string): string {
		// console.log(" Backend client.user:", client.user, "send message", payload);
		console.log("payload: ", payload);
		// console.log("client.id:");
		// console.log(client.id);
		// console.log("server.id:");
		// console.log(client);
		// console.log("client", client);

		this.chatService.emitMessage(this.server, 1, JSON.parse(payload));

		// console.log("client.user.id", client.user.id);

		// console.log("<<<");
		
		
		// client.emit("banaan:nieuw", "ook hallo");
		// client.emit("banaan:delete", "delete it appie!!");
		// this.server.emit("banaan:nieuw", "server.emit: ook hallo");
		// this.server.to(client.id).emit("........");
		// this.server.to()
		// server.to(roomid).emit("startMatch");
		return "hallo terug";
	}
}
