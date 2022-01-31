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
		this.gameService.leaveInviteForced(client);
		this.server.to("SpecBooth").emit("spectateUpdate");
	}

	handleConnection(client: Socket, ...args: string[]): void {
		this.logger.log(`game::Client connected: ${client.id}`);
	}

	@SubscribeMessage("positionUpdate")
	positionUpdate(client: GuardedSocket, payload: boolean[]): void {
		this.gameService.handlePositionUpdate(client, payload);
	}

	@UseGuards(JwtAuthGuard)
	@SubscribeMessage("joinGame")
	joinGame(client: GuardedSocket, payload: string): void {
		this.gameService.joinGame(this.server, client, payload);
	}

	@UseGuards(JwtAuthGuard)
	@SubscribeMessage("leaveGame")
	leaveGame(client: GuardedSocket, payload: string): void {
		this.gameService.leaveGame(this.server, client, payload);
	}

	@UseGuards(JwtAuthGuard)
	@SubscribeMessage("createNewGame")
	createNewGame(client: GuardedSocket, payload: string): string {
		const res =this.gameService.createLobby(client, this.server);
		this.server.to("SpecBooth").emit("spectateUpdate");
		return res;
	}

	@UseGuards(JwtAuthGuard)
	@SubscribeMessage("enterSpectatorBooth")
	enterSpectatorBooth(client: GuardedSocket, payload: string): void {
		client.join("SpecBooth");
	}

	@UseGuards(JwtAuthGuard)
	@SubscribeMessage("leaveSpectatorBooth")
	leaveSpectatorBooth(client: GuardedSocket, payload: string): void {
		client.leave("SpecBooth");
	}

	@UseGuards(JwtAuthGuard)
	@SubscribeMessage("leaveInvite")
	leaveInvite(client: GuardedSocket, payload: string): void {
		console.log("LEAVIN THE TING");
		this.gameService.leaveInvite(client, payload);
		this.server.to("SpecBooth").emit("spectateUpdate");
	}
}
