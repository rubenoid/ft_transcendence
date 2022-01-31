import { Injectable, Get, Req, Param } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { UserEntity } from "../user/user.entity";

@Injectable()
export class AchievementsService {
	constructor(private readonly userService: UserService) {}

	firstWin(user: UserEntity): void {
		user.achievements.push("First Win!");
	}

	threeWins(user: UserEntity): void {
		user.achievements.push("Won Three Times!");
	}

	friendAdded(user: UserEntity): void {
		user.achievements.push("Friendzone");
	}

	async getACHV(toFind: number): Promise<string[] | string> {
		const user = await this.userService.getUserQueryOne({
			where: { id: toFind },
		});
		return user.achievements;
	}
}
