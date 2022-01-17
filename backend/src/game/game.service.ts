import { Injectable, Inject, forwardRef } from "@nestjs/common";
import { Server, Socket } from "socket.io";
import { UserEntity } from "src/user/user.entity";
import { UserService } from "src/user/user.service";
import { GuardedSocket } from "src/overloaded";
import { MatchService } from "../match/match.service";
import { Line, Point, RunningGame } from "./runningGame.service";

const maps: Line[][] = [
	[
		new Line(new Point(20, 20), new Point(20, 580)),
		new Line(new Point(380, 20), new Point(380, 580)),
	],
	[
		new Line(new Point(20, 20), new Point(20, 580)),
		new Line(new Point(380, 20), new Point(380, 580)),
		new Line(new Point(20, 300), new Point(100, 300)),
		new Line(new Point(300, 300), new Point(380, 300)),
	],
	[
		new Line(new Point(20, 20), new Point(20, 580)),
		new Line(new Point(380, 20), new Point(380, 580)),
		new Line(new Point(80, 150), new Point(120, 150)),
		new Line(new Point(280, 150), new Point(320, 150)),
		new Line(new Point(80, 450), new Point(120, 450)),
		new Line(new Point(280, 450), new Point(320, 450)),
	],
];

@Injectable()
export class GameService {
	games: RunningGame[] = [];
	gameId = 0;

	constructor(
		@Inject(forwardRef(() => MatchService))
		private matchService: MatchService,
		private userService: UserService,
	) {}

	handleFinishedGame(finished: RunningGame): void {
		this.userService.updateUserStatus(
			finished.server,
			finished.players[0],
			"Online",
		);
		this.userService.updateUserStatus(
			finished.server,
			finished.players[1],
			"Online",
		);

		const idx = this.games.findIndex(
			(x) => "runningGame" + x.roomId === finished.roomId,
		);

		this.matchService.saveMatch(finished);
		this.games.splice(idx, 1);
	}

	startMatch(
		client1: GuardedSocket,
		client2: GuardedSocket,
		server: Server,
	): void {
		console.log("in start match");
		console.log("adding" + client1.id + " and " + client2.id);
		const roomid = "runningGame" + this.gameId++;

		client1.join(roomid);
		client2.join(roomid);

		this.userService.updateUserStatus(server, client1, "In game");
		this.userService.updateUserStatus(server, client2, "In game");

		const mapid = Math.round(Math.random() * 2);
		this.games.push(
			new RunningGame([client1, client2], maps[mapid], roomid, server, this),
		);
		server.to(roomid).emit("startMatch");
	}

	async handlePositionUpdate(client: Socket, keys: boolean[]): Promise<void> {
		const game = this.games.find(
			(x) => x.players[0].id == client.id || x.players[1].id == client.id,
		);
		if (game != undefined) {
			game.updatePos(keys, game.players[1].id == client.id ? 1 : 0);
		}
	}
}
