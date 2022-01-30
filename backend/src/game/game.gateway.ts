import {
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from "@nestjs/websockets";
import { Logger, UseGuards } from "@nestjs/common";
import { Server, Socket } from "socket.io";
import { GameService } from "./game.service";
import { GuardedSocket } from "src/overloaded";
import { JwtAuthGuard } from "../auth/jwt.guard";

@WebSocketGateway()
export class GameGateway {
	@WebSocketServer() server: Server;
	constructor(private gameService: GameService) {}

	private logger: Logger = new Logger("gameGateway");

	afterInit(server: Server): void {
		this.logger.log("Init");
	}

	handleDisconnect(client: Socket): void {
		this.logger.log(`game::Client disconnected: ${client.id}`);
	}

	handleConnection(client: Socket, ...args: string[]): void {
		this.logger.log(`game::Client connected: ${client.id}`);
	}

	@SubscribeMessage("positionUpdate")
	positionUpdate(client: GuardedSocket, payload: boolean[]): void {
		this.gameService.handlePositionUpdate(client, payload);
	}

	@SubscribeMessage("joinGame")
	joinGame(client: GuardedSocket, payload: string): void {
		this.gameService.joinGame(this.server, client, payload);
	}

	@UseGuards(JwtAuthGuard)
	@SubscribeMessage("createNewGame")
	createNewGame(client: GuardedSocket, payload: string): string {
		return this.gameService.createLobby(client, this.server);
	}
}
