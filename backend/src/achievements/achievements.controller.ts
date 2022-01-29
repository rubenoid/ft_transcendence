import { Controller, Get, Param, Req } from "@nestjs/common";
import { GuardedRequest } from "src/overloaded";
import { UserEntity } from "src/user/user.entity";
import { AchievementsService } from "./achievements.service";

@Controller("achievements")
export class AchievementsController {
    constructor(private readonly achievenmentsService: AchievementsService) {}

    @Get("abc/:id")
    async getA(@Param("id"): string) : Promise<
}