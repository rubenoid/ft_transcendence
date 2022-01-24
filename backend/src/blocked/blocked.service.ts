import { Injectable } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { FriendsService } from "../friends/friends.service";
import { UserEntity } from "src/user/user.entity";
import { relative } from "path/posix";
// import { FriendsController } from 'src/friends/friends.controller';
// import { FriendsModule } from 'src/friends/friends.module';

@Injectable()
export class BlockedService {
	constructor(
		private readonly userService: UserService,
		private readonly friendService: FriendsService,
	) {}

	async findUserWithBlocked(id: number): Promise<UserEntity> {
		const user: UserEntity = await this.userService.getUserQueryOne({
			where: { id: id },
			relations: ["blockedUsers", "blockedBy"],
		});
		if (!user) {
			throw "User can not be loaded";
		}
		return user;
	}

	async blockUser(idMe: number, idToBlock: number): Promise<void> {
		if (idMe == idToBlock) {
			throw "Cannot block yourself";
		}
		const user: UserEntity = await this.findUserWithBlocked(idMe);
		if (user.blockedUsers.find((e) => e.id == idToBlock))
			throw "User alread blocked";
		const userToBlock: UserEntity = await this.findUserWithBlocked(idToBlock);
		if (!user.blockedUsers) user.blockedUsers = [];
		if (!userToBlock.blockedBy) userToBlock.blockedBy = [];
		user.blockedUsers.push(userToBlock);
		userToBlock.blockedBy.push(user);
		await this.userService.saveUser(user);
		await this.userService.saveUser(userToBlock);
		this.friendService.remove(idMe, idToBlock);
	}

	async getAll(id: number): Promise<Array<UserEntity>> {
		const user = await this.findUserWithBlocked(id);
		const usersBlocked = user.blockedUsers;
		return usersBlocked;
	}

	async remove(id: number, idToUnblock: number): Promise<boolean> {
		const user = await this.findUserWithBlocked(id);
		const userBlocked = await this.findUserWithBlocked(idToUnblock);

		const indexBlocked = user.blockedUsers.findIndex(
			(e) => e.id == idToUnblock,
		); // returns -1 if not found
		if (indexBlocked < 0) {
			throw "Can not unblock, because user is not blocked";
		}
		const indexBlockedBy = userBlocked.blockedBy.findIndex((e) => e.id == id);
		if (indexBlockedBy < 0) {
			throw "Can not find index of blockedBy. Serieus issue because this should not be able happen";
		}
		user.blockedUsers.splice(indexBlocked, 1);
		userBlocked.blockedBy.splice(indexBlockedBy, 1);

		await this.userService.saveUser(user);
		await this.userService.saveUser(userBlocked);

		return true;
	}
}
