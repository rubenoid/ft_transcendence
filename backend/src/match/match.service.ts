import { Injectable, Inject, forwardRef } from "@nestjs/common";
import { MatchEntity } from "./match.entity";
import { Repository } from "typeorm";
import { UserEntity } from "src/user/user.entity";
import { UserService } from "src/user/user.service";
import { Server, Socket } from "socket.io";
import { GameService } from "src/game/game.service";
import { RunningGame } from "src/game/runningGame.service";
import { GuardedSocket } from "src/overloaded";
import { RatingService } from "src/rating/rating";
import { AchievementsService } from "src/achievements/achievements.service";

const queuedSock: GuardedSocket[] = [];

@Injectable()
export class MatchService {
	constructor(
		@Inject("MATCH_REPOSITORY")
		private MatchRepository: Repository<MatchEntity>,
		private userService: UserService,
		private ratingService: RatingService,
		@Inject(forwardRef(() => GameService))
		private gameService: GameService,
		private achievementsService: AchievementsService,
	) {}

	async removeFromQueue(socket: Socket): Promise<void> {
		const idx = queuedSock.findIndex((x) => x.id == socket.id);

		if (idx != -1) {
			queuedSock.splice(idx, 1);
		}
	}

	async addPlayerToQueue(
		connection: GuardedSocket,
		server: Server,
	): Promise<string> {
		if (queuedSock.find((x) => x.id == connection.id)) return;
		queuedSock.push(connection);

		if (queuedSock.length >= 2) {
			const p1 = queuedSock.pop();
			const p2 = queuedSock.pop();
			this.gameService.startMatch(p1, p2, server);
		}
	}

	async saveMatch(game: RunningGame): Promise<void> {
		const toAdd = new MatchEntity();

		toAdd.id = game.roomId;
		toAdd.scorePlayer1 = game.score[0];
		toAdd.scorePlayer2 = game.score[1];

		const players = [
			await this.userService.getUserQueryOne({
				where: { id: game.players[0].user.id },
			}),
			await this.userService.getUserQueryOne({
				where: { id: game.players[1].user.id },
			}),
		];
		if (game.score[0] > game.score[1]) {
			players[0].wins++;
			players[1].losses++;
		} else {
			players[1].wins++;
			players[0].losses++;
		}

		players[0].rating = this.ratingService.newRating(
			players[0].rating,
			players[1].rating,
			game.score[0],
			game.score[1],
		);
		players[1].rating = this.ratingService.newRating(
			players[1].rating,
			players[0].rating,
			game.score[1],
			game.score[0],
		);

		toAdd.players = [players[0], players[1]];
		if (players[0].id == players[1].id) return;
		this.MatchRepository.save(toAdd);
		this.userService.saveUser(players[0]).then(() => {
			this.achievementsService.addACHV(players[0]);
		});
		this.userService.saveUser(players[1]).then(() => {
			this.achievementsService.addACHV(players[1]);
		});
	}

	async getMatch(id: string): Promise<MatchEntity> {
		const Match = await this.MatchRepository.findOne({
			where: { id: id },
			relations: ["players"],
		});
		if (Match === undefined) throw "Match not found";
		return Match;
	}

	async getUserMatches(
		userId: number,
		toFind: number,
	): Promise<MatchEntity[] | string> {
		const user: UserEntity = await this.userService.getUserQueryOne({
			where: { id: toFind },
			relations: ["matches", "blockedUsers", "blockedBy"],
		});
		if (userId != -1 && user.blockedUsers.find((x) => x.id == userId)) {
			return undefined;
		}
		if (userId != -1 && user.blockedBy.find((x) => x.id == userId)) {
			return "1";
		}
		const matches: MatchEntity[] = [];
		for (let i = 0; i < user.matches.length; i++) {
			const e = user.matches[i];
			const matchFind: MatchEntity = await this.MatchRepository.findOne({
				where: { id: user.matches[i].id },
				relations: ["players"],
			});
			matches.push(matchFind);
		}
		return matches;
	}

	async getAllMatches(): Promise<MatchEntity[]> {
		const Match = await this.MatchRepository.find({ relations: ["players"] });
		return Match;
	}
}
