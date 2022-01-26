import { Controller, Get, Param, Req } from "@nestjs/common";
import { GuardedRequest } from "src/overloaded";
import { MatchEntity } from "./match.entity";
import { MatchService } from "./match.service";

@Controller("match")
export class MatchController {
	constructor(private readonly matchService: MatchService) {}

	@Get("getMatch/:id")
	async getMatch(@Param("id") id: string): Promise<MatchEntity> {
		return await this.matchService.getMatch(id);
	}

	@Get("getUserHistory/:id")
	async getUserHistory(
		@Req() req: GuardedRequest,
		@Param("id") id: string,
	): Promise<MatchEntity[] | string> {
		return await this.matchService.getUserMatches(req.user.id, parseInt(id));
	}

	@Get("getMyUserHistory")
	async getMyUserHistory(
		@Req() req: GuardedRequest,
	): Promise<MatchEntity[] | string> {
		return await this.matchService.getUserMatches(-1, req.user.id as number);
	}

	@Get("getAllMatches")
	async getAllMatches(): Promise<MatchEntity[]> {
		return await this.matchService.getAllMatches();
	}
}
