import { Injectable } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { UserEntity } from "../user/user.entity";

@Injectable()
export class FriendsService {
	constructor(private readonly userService: UserService) {}

	async findUserWithrelations(id: number) : Promise<UserEntity> {
		const user : UserEntity =  await this.userService.getUserQueryOne(
			{ where: { id: id },
			relations: ["friends", "blockedUsers", "blockedBy"],
		});
		if (!user) {
			throw "User can not be loaded";
		}
		return user;
	}

	async addFriend(id: number, id2: number): Promise<void> {
		// add here that cannot add as a friend if already blocked
		if (id == id2) throw "Cannot add yourself";
		const user = await this.findUserWithrelations(id);
		const friend = await this.findUserWithrelations(id2);
		if ((user.blockedUsers.find((e) => e.id == id2)) 
			|| (user.blockedBy.find((e) => e.id == id2))) {
			return;
		}
		if (!user.friends) user.friends = [];
		if (!friend.friends) friend.friends = [];
		user.friends.push(friend);
		friend.friends.push(user);
		await this.userService.saveUser(user);
		await this.userService.saveUser(friend);
	}

	async getFriends(id: number): Promise<UserEntity[]> {
		const user = await this.userService.getUserQueryOne({
			where: { id: id },
			relations: ["friends"],
		});
		return user.friends;
	}

	async remove(id: number, id2: number): Promise<void> {
		if (id == id2) throw "Cannot add yourself";
		const user = await this.findUserWithrelations(id);
		const friend = await this.findUserWithrelations(id2);
		if (!user.friends) user.friends = [];
		if (!friend.friends) friend.friends = [];
		const friendidx = user.friends.findIndex((x) => x.id == friend.id);
		const useridx = friend.friends.findIndex((x) => x.id == user.id);
		user.friends.splice(friendidx, 1);
		friend.friends.splice(useridx, 1);
		await this.userService.saveUser(user);
		await this.userService.saveUser(friend);
	}
}
