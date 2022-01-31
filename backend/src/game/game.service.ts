import { Injectable, Inject, forwardRef } from "@nestjs/common";
import { Server, Socket } from "socket.io";
import { UserService } from "src/user/user.service";
import { GuardedSocket } from "src/overloaded";
import { MatchService } from "../match/match.service";
import { Line, Point, RunningGame } from "./runningGame.service";
import { UserEntity } from "src/user/user.entity";

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

export interface runDownGame {
	players: UserEntity[];
	score: number[];
	id: string;
}

@Injectable()
export class GameService {
	games: RunningGame[] = [];
	gameId = 0;

	constructor(
		@Inject(forwardRef(() => MatchService))
		private matchService: MatchService,
		private userService: UserService,
	) {}

	getRunningGame(id: string): RunningGame | undefined {
		return this.games.find((x) => x.roomId == id);
	}

	async getRunningGames(): Promise<runDownGame[]> {
		const ret: runDownGame[] = [];
		for (let i = 0; i < this.games.length; i++) {
			const e = this.games[i];
			ret.push({
				players: [
					await this.userService.getUserQueryOne({
						where: { id: e.players[0].user.id },
					}),
					await this.userService.getUserQueryOne({
						where: { id: e.players[1].user.id },
					}),
				],
				score: e.score,
				id: e.roomId,
			});
		}
		return ret;
	}

	joinGame(server: Server, client: GuardedSocket, id: string): void {
		const game = this.getRunningGame(id);
		if (game) {
			client.join(game.roomId);
			if (game.players.length < 2) {
				game.players.push(client);
				if (game.players.length == 2) {
					game.run();
					server.to(game.roomId).emit("startMatch", game.roomId);
				}
			} else {
				const playerIndex = game.players.findIndex((x) => x.user.id == client.user.id)
				if (playerIndex != -1)
				{
					game.players[playerIndex] = client;
				}
				server.to(client.id).emit("gameInit", {
					decor: game.decor,
					players: [game.players[0].user.id, game.players[1].user.id],
				});
			}
		}
	}

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

		const idx = this.games.findIndex((x) => x.roomId === finished.roomId);

		this.matchService.saveMatch(finished);
		this.games.splice(idx, 1);
	}

	startMatch(
		client1: GuardedSocket,
		client2: GuardedSocket,
		server: Server,
	): void {
		const roomid = (Math.random() + 1).toString(36).substring(7);

		client1.join(roomid);
		client2.join(roomid);

		this.userService.updateUserStatus(server, client1, "In game");
		this.userService.updateUserStatus(server, client2, "In game");

		const mapid = Math.round(Math.random() * 2);
		const newGame = new RunningGame(
			[client1, client2],
			maps[mapid],
			roomid,
			server,
			this,
		);

		this.games.push(newGame);
		newGame.run();
		server.to(roomid).emit("startMatch", roomid);
	}

	createLobby(client: GuardedSocket, server: Server): string {
		const roomid = (Math.random() + 1).toString(36).substring(7);

		const mapid = Math.round(Math.random() * 2);
		const newGame = new RunningGame(
			[client],
			maps[mapid],
			roomid,
			server,
			this,
		);

		client.join(newGame.roomId);
		this.games.push(newGame);

		return roomid;
	}

	async handlePositionUpdate(client: Socket, keys: boolean[]): Promise<void> {
		const game = this.games.find(
			(x) =>
				(x.players[0] && x.players[0].id == client.id) ||
				(x.players[1] && x.players[1].id == client.id),
		);
		if (game != undefined) {
			game.updatePos(keys, game.players[1].id == client.id ? 1 : 0);
		}
	}
}
