import { Controller, Get, Param } from "@nestjs/common";
import { MatchEntity } from "./match.entity";
import { MatchService } from "./match.service";

@Controller("match")
export class MatchController {
	constructor(private readonly matchService: MatchService) {}
	@Get("newMatch/:id1/:id2")
	async newMatch(
		@Param("id") id: string,
		@Param("id2") id2: string,
	): Promise<string> {
		return await this.matchService.newMatch(parseInt(id), parseInt(id2));
	}

	@Get("increaseScore/:matchid/:playerid")
	async increaseScore(
		@Param("matchid") matchid: string,
		@Param("playerid") playerid: string,
	): Promise<void> {
		return await this.matchService.increaseScore(
			parseInt(matchid),
			parseInt(playerid),
		);
	}

	@Get("getMatch/:id")
	async getMatch(@Param("id") id: string): Promise<MatchEntity> {
		return await this.matchService.getMatch(parseInt(id));
	}

	@Get("getUserHistory/:id")
	async getUserHistory(@Param("id") id: string): Promise<MatchEntity[]> {
		return await this.matchService.getUserMatches(parseInt(id));
	}

	@Get("getAllMatchs")
	async getAllMatchs(): Promise<MatchEntity[]> {
		return await this.matchService.getAllMatches();
	}
}
