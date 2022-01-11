import { Logger, Req, UseGuards } from "@nestjs/common";
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

	afterInit(server: Server): void {
		this.logger.log("Init");
	}

	handleDisconnect(client: Socket): void {
		this.logger.log(`Match::Client disconnected: ${client.id}`);
		this.matchService.removeFromQueue(client);
	}

	handleConnection(client: Socket, ...args: string[]): void {
		this.logger.log(`Match::Client connected: ${client.id}`);
	}
	// async getme(@Req() req, @Param() param) {
	// 	return await this.userService.getUser(req.user.id as number);
	@UseGuards(JwtAuthGuard)
	@SubscribeMessage("addToQueue")
	handleMessage(client: GuardedSocket, payload: string): void {
		this.matchService.addPlayerToQueue(client, this.server);
	}

	@UseGuards(JwtAuthGuard)
	@SubscribeMessage("removeFromQueue")
	removeFromQueue(client: GuardedSocket) {
		this.matchService.removeFromQueue(client);
	}
}
