import { Injectable, Inject, Post } from "@nestjs/common";
import { MatchEntity } from "./match.entity";
import { Repository } from "typeorm";
import { UserEntity } from "src/user/user.entity";
import { UserService } from "src/user/user.service";
import { Server, Socket } from "socket.io";
import { GameService } from "src/game/game.service";

const queuedSock: Socket[] = [];

@Injectable()
export class MatchService {
	constructor(
		@Inject("MATCH_REPOSITORY")
		private MatchRepository: Repository<MatchEntity>,
		private userService: UserService,
		private gameService: GameService,
	) {}

	async removeFromQueue(socket: Socket): Promise<void> {
		const idx = queuedSock.findIndex((x) => x.id == socket.id);

		if (idx != -1) {
			queuedSock.splice(idx, 1);
			console.log("removed " + socket.id + " from queue", queuedSock.length);
		}
	}

	async newMatch(Playerid1: number, Playerid2: number): Promise<string> {
		const User1 = await this.userService.getUserQueryOne({
			where: { id: Playerid1 },
			relations: ["matches"],
		});
		if (!User1) throw "User one not found";
		const User2 = await this.userService.getUserQueryOne({
			where: { id: Playerid2 },
			relations: ["matches"],
		});
		if (!User2) throw "User two not found";
		const newMatch: MatchEntity = new MatchEntity();
		newMatch.players = [User1, User2];
		newMatch.scorePlayer1 = 0;
		newMatch.scorePlayer2 = 0;
		await this.MatchRepository.save(newMatch);

		if (!User1.matches) User1.matches = [];
		if (!User2.matches) User2.matches = [];
		User1.matches.push(newMatch);
		User2.matches.push(newMatch);

		this.userService.saveUser(User1);
		this.userService.saveUser(User2);
		return (
			"Match created between" +
			newMatch.players[0].id +
			"and" +
			newMatch.players[1].id
		);
	}

	async addPlayerToQueue(connection: Socket, server: Server): Promise<string> {
		if (queuedSock.find((x) => x.id == connection.id)) return;
		queuedSock.push(connection);
		console.log("playerr " + connection.id + " qued");

		if (queuedSock.length >= 2) {
			const p1 = queuedSock.pop();
			const p2 = queuedSock.pop();
			this.gameService.startMatch(p1, p2, server);
		}
	}

	async increaseScore(Matchid: number, Playerid: number): Promise<void> {
		const Match = await this.MatchRepository.findOne({
			where: { id: Matchid },
		});
		if (!Match) throw "No match found";
		if (Playerid === Match.players[0].id) Match.scorePlayer1++;
		else if (Playerid === Match.players[1].id) Match.scorePlayer2++;
		else throw "No player with id " + Playerid + " in match " + Matchid;
		await this.MatchRepository.save(Match);
	}
	async getMatch(id: number): Promise<MatchEntity> {
		const Match = await this.MatchRepository.findOne({
			where: { id: id },
			relations: ["players"],
		});
		if (Match === undefined) throw "Match not found";
		return Match;
	}

	async getUserMatches(id: number): Promise<MatchEntity[]> {
		const user: UserEntity = await this.userService.getUserQueryOne({
			where: { id: id },
			relations: ["matches"],
		});

		return user.matches;
	}

	async getAllMatches(): Promise<MatchEntity[]> {
		const Match = await this.MatchRepository.find({ relations: ["players"] });
		if (Match.length === 0) throw "user not found";
		return Match;
	}

	async getQueuedPlayer(): Promise<string> {
		if (!quedplayer) return "No queued players";
		return "Queued player with id" + quedplayer;
	}
}
