import { Controller, Get, Param, Req } from "@nestjs/common";
import { identity } from "rxjs";
import { GuardedRequest } from "src/overloaded";
import { UserEntity } from "src/user/user.entity";
import { AchievementsService } from "./achievements.service";

@Controller("achievements")
export class AchievementsController {
	constructor(private readonly achievenmentsService: AchievementsService) {}

	@Get("get/:id")
	async getACHV(@Param("id") id: string): Promise<string[] | string> {
		return await this.achievenmentsService.getACHV(parseInt(id));
	}
}
