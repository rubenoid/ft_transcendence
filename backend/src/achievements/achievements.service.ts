import { Injectable, Get, Req, Param } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { UserEntity } from "../user/user.entity";

@Injectable()
export class AchievementsService {
    constructor(private readonly userService: UserService) {}

    addFirstWin(user: UserEntity): void {
        user.achievements.push('First Win!');
    }

    addThreeWins(user: UserEntity): void {
        user.achievements.push('Won Three Times!');
    }

    async getACHV(toFind: number): Promise<string[] | string> {
		const user = await this.userService.getUserQueryOne({
			where: { id: toFind }	
		});
        //user.achievements.push('First Game Won'!);
        this.addFirstWin(user);
        
        this.userService.saveUser(user);
		return user.achievements;
	}
}