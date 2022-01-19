import { Controller, Get, Param } from "@nestjs/common";
import { GameService } from "./game.service";
import { MatchService } from "../match/match.service";

@Controller("game")
export class GameController {
	constructor(
		private gameService: GameService,
		private matchService: MatchService,
	) {}

	@Get("getDetails/:id")
	async getDetails(@Param("id") id: string): Promise<object | undefined> {
		const gameFound = this.gameService.getRunningGame(id);
		if (gameFound !== undefined) {
			const playerids = [];
			for (let i = 0; i < gameFound.players.length; i++) {
				const e = gameFound.players[i];
				playerids.push(e.user.id);
			}
			return { running: true, scores: gameFound.score, players: playerids };
		} else {
			const result = await this.matchService.getMatch(id);
			if (!result) return undefined;
			const playerids = [];
			for (let i = 0; i < result.players.length; i++) {
				const e = result.players[i];
				playerids.push(e.id);
			}
			console.log(result);
			return {
				running: false,
				scores: [result.scorePlayer1, result.scorePlayer2],
				players: playerids,
			};
		}
	}
}
