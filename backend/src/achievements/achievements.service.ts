import { Injectable, Get, Req, Param } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { UserEntity } from "../user/user.entity";
import { AchievementsEntity } from "./achievements.entity";

let achv: Array<string> = ['First Win!', 'Won Three Matches', 'Pain = Gain', 'Friendzone', 'BLOCKED USER'];

@Injectable()
export class AchievementsService {
	constructor(private readonly userService: UserService) {}

	async createNewAchievement(title: string, desc: string, userRef: UserEntity) {
		const toAdd = new AchievementsEntity;
	
		toAdd.title = title;
		toAdd.description = desc;
		toAdd.date = Math.floor(Date.now() / 1000);

		//const user = await this.userService.getUserQueryOne({where: {id: userRef.id}, relations: ["achievements"]})
	
		userRef.achievements.push(toAdd);

		await this.userService.saveUser(userRef);
	}

	firstWin(user: UserEntity): void {
		this.createNewAchievement(achv[0], 'You won your first match. Keep it up!', user);
	}

	threeWins(user: UserEntity): void {
		this.createNewAchievement(achv[1], 'Three matches won!', user);
	}

	lostMatch(user: UserEntity): void {
		this.createNewAchievement(achv[2], 'You lost a match.', user);
	}

	friendAdded(user: UserEntity): void {
		this.createNewAchievement(achv[3], 'You added a friend. Sweet.', user);
	}

	blockedUser(user: UserEntity): void {
		this.createNewAchievement(achv[4], 'You blocked a user. We are sure you had your reasons.', user);
	}

    async addACHV(user: UserEntity)
    {
		const userExt = await this.userService.getUserQueryOne({where: {id: user.id}, relations: ["achievements", "friends", "blockedUsers"]})

        if (userExt.wins === 1 && !userExt.achievements.find(x => x.title === achv[0]))
            this.firstWin(userExt);
        else if (userExt.wins === 3 && !userExt.achievements.find(x => x.title === achv[1]))
            this.threeWins(userExt);
		else if (userExt.losses === 1 && !userExt.achievements.find(x => x.title === achv[2]))
			this.lostMatch(userExt);
        else if (userExt.friends.length === 1 && !userExt.achievements.find(x => x.title === achv[3]))
            this.friendAdded(userExt);
		else if (userExt.blockedUsers.length === 1 && !userExt.achievements.find(x => x.title === achv[4]))
			this.blockedUser(userExt);
    }

	async getACHV(toFind: number): Promise<AchievementsEntity[]> {
		const user = await this.userService.getUserQueryOne({
			where: { id: toFind },
			relations: ["achievements"]
		});
		return user.achievements;
	}
}
