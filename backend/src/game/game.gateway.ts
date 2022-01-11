import {
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from "@nestjs/websockets";
import { Logger, Req, UseGuards } from "@nestjs/common";
import { Server, Socket } from "socket.io";
import { GameService } from "./game.service";
import { GuardedSocket } from "src/overloaded";

@WebSocketGateway()
export class GameGateway {
	@WebSocketServer() server: Server;
	constructor(private gameService: GameService) {}

	private logger: Logger = new Logger("MatchGateway");

	afterInit(server: Server): void {
		this.logger.log("Init");
	}

	handleDisconnect(client: Socket): void {
		this.logger.log(`Match::Client disconnected: ${client.id}`);
	}

	handleConnection(client: Socket, ...args: string[]): void {
		this.logger.log(`Match::Client connected: ${client.id}`);
	}

	@SubscribeMessage("positionUpdate")
	handleMessage(client: GuardedSocket, payload: boolean[]): void {
		this.gameService.handlePositionUpdate(client, payload);
	}
}
