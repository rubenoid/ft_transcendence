import { Controller, Get, Param } from "@nestjs/common";
import { AchievementsEntity } from "./achievements.entity";
import { AchievementsService } from "./achievements.service";

@Controller("achievements")
export class AchievementsController {
	constructor(private readonly achievenmentsService: AchievementsService) {}

	@Get("get/:id")
	async getACHV(@Param("id") id: string): Promise<AchievementsEntity[]> {
		return await this.achievenmentsService.getACHV(parseInt(id));
	}
}
