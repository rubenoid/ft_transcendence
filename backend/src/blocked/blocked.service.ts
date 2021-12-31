import { Injectable } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { FriendsService } from "../friends/friends.service";
// import { FriendsController } from 'src/friends/friends.controller';
// import { FriendsModule } from 'src/friends/friends.module';

@Injectable()
export class BlockedService {
	constructor(
		private readonly userService: UserService,
		private readonly friendService: FriendsService,
	) {}

	async blockUser(idMe: number, idToBlock: number) {
		if (idMe == idToBlock) {
			throw "Cannot block yourself";
		}
		const user = await this.userService.getUserQueryOne({
			where: { id: idMe },
		});
		if (!user) throw "User can not be loaded";
		if (user.blockedUsers.find((element) => element == idToBlock))
			throw "User alread blocked";
		const userToBlock = await this.userService.getUserQueryOne({
			where: { id: idToBlock },
		});
		if (!userToBlock)
			throw "User you want to block does not exist or can not be loaded";
		user.blockedUsers.push(userToBlock.id);
		userToBlock.blockedBy.push(user.id);
		await this.userService.saveUser(user);
		await this.userService.saveUser(userToBlock);
		this.friendService.remove(idMe, idToBlock);
	}

	async getAll(id: number): Promise<Array<number>> {
		const user = await this.userService.getUserQueryOne({ where: { id: id } });
		const usersBlocked = user.blockedUsers;
		return usersBlocked;
	}

	async remove(id: number, idToUnblock: number) {
		const user = await this.userService.getUserQueryOne({ where: { id: id } });
		const userBlocked = await this.userService.getUserQueryOne({
			where: { id: idToUnblock },
		});

		const indexBlocked = user.blockedUsers.findIndex((e) => e == idToUnblock); // returns -1 if not found
		if (indexBlocked < 0) throw "Can not unblock, because user is not blocked";
		user.blockedUsers.splice(indexBlocked, 1);

		const indexBlockedBy = userBlocked.blockedBy.findIndex((e) => e == id);
		if (indexBlockedBy < 0)
			throw "Can not find index of blockedBy. Serieus issue because this should not be able happen";
		userBlocked.blockedBy.splice(indexBlockedBy, 1);

		await this.userService.saveUser(user);
		await this.userService.saveUser(userBlocked);

		return true;
	}

	// async getblocked(id: number) : Promise<UserEntity[]>
	// {
	// 	const user = await this.userService.getUserQuery({where: {id: id}, relations: ["friends"]});
	// 	return user;
	// }
	// async remove(id: number, id2: number)
	// {
	// 	if (id == id2)
	// 		throw "Cannot add yourself";
	// 	const user = await this.userService.getUserQueryOne({where: {id: id}, relations: ["friends"]});
	// 	const friend = await this.userService.getUserQueryOne({where: {id: id2}, relations: ["friends"]});
	// 	if (!user)
	// 		throw "User can not be loaded";
	//     if (!friend)
	//         throw "Friend does not exist or can not be loaded";
	// 	if (!user.friends)
	// 		user.friends = [];
	// 	if (!friend.friends)
	// 		friend.friends = [];
	// 	const friendidx = user.friends.findIndex((x) => x.id == friend.id);
	// 	const useridx = friend.friends.findIndex((x) => x.id == user.id);
	// 	user.friends.splice(friendidx, 1);
	// 	friend.friends.splice(useridx, 1);
	// 	const result2 = await this.userService.saveUser(user);
	// 	const result = await this.userService.saveUser(friend);
	// }
}
