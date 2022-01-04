import { Injectable, Inject, Post } from "@nestjs/common";
import { MatchEntity } from "./match.entity";
import { Repository } from "typeorm";
import { UserEntity } from "src/user/user.entity";
import { UserService } from "src/user/user.service";
import { Server, Socket } from "socket.io";
import { GameService } from "src/game/game.service";

let queuedSock: Socket;

@Injectable()
export class MatchService {
	constructor(
		@Inject("MATCH_REPOSITORY")
		private MatchRepository: Repository<MatchEntity>,
		private userService: UserService,
		private gameService: GameService
	) {}

	async newMatch(Playerid1: number, Playerid2: number) {
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

	async addPlayerToQueue(connection: Socket, server: Server) {
		if (!queuedSock) {
			queuedSock = connection;
			return "playerr" + connection.id + "qued";
		}
		if (queuedSock.id === connection.id)
			return "player" + connection.id + "cannot play a match against themselves";
		const connection2 = queuedSock;
		this.gameService.startMatch(connection, connection2, server);
		queuedSock = null;
		// return this.newMatch(Qid, User.id);
	}

	async increaseScore(Matchid: number, Playerid: number) {
		const Match = await this.MatchRepository.findOne({
			where: { id: Matchid },
		});
		if (!Match) throw "No match found";
		if (Playerid === Match.players[0].id) Match.scorePlayer1++;
		else if (Playerid === Match.players[1].id) Match.scorePlayer2++;
		else throw "No player with id " + Playerid + " in match " + Matchid;
		await this.MatchRepository.save(Match);
	}
	async getMatch(id: number) {
		const Match = await this.MatchRepository.findOne({
			where: { id: id },
			relations: ["players"],
		});
		if (Match === undefined) throw "Match not found";
		return Match;
	}

	async getUserMatches(id: number) {
		const user: UserEntity = await this.userService.getUserQueryOne({
			where: { id: id },
			relations: ["matches"],
		});

		return user.matches;
	}

	async getAllMatches() {
		const Match = await this.MatchRepository.find({ relations: ["players"] });
		if (Match.length === 0) throw "user not found";
		return Match;
	}
	async getQueuedPlayer() {
		if (!queuedSock) return "No queued players";
		return "Queued player with id" + queuedSock;
	}
}
