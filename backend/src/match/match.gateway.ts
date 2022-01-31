import { Logger, UseGuards } from "@nestjs/common";
import {
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { JwtAuthGuard } from "src/auth/jwt.guard";
import { GuardedSocket } from "src/overloaded";
import { MatchService } from "./match.service";

@WebSocketGateway()
export class MatchGateway {
	@WebSocketServer() server: Server;
	constructor(private matchService: MatchService) {}

	private logger: Logger = new Logger("MatchGateway");

	handleDisconnect(client: Socket): void {
		this.logger.log(`Match::Client disconnected: ${client.id}`);
		this.matchService.removeFromQueue(client);
	}

	handleConnection(client: Socket): void {
		this.logger.log(`Match::Client connected: ${client.id}`);
	}

	@UseGuards(JwtAuthGuard)
	@SubscribeMessage("addToQueue")
	addToQueue(client: GuardedSocket): void {
		this.matchService.addPlayerToQueue(client, this.server);
	}

	@UseGuards(JwtAuthGuard)
	@SubscribeMessage("removeFromQueue")
	removeFromQueue(client: GuardedSocket): void {
		this.matchService.removeFromQueue(client);
	}
}
