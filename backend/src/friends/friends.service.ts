import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/user.entity';

@Injectable()
export class FriendsService {

	constructor(private readonly userService: UserService) {}

	async addFriend(id: number, id2: number)
	{
		if (id == id2)
			throw "Cannot add yourself";
		const user = await this.userService.getUserQueryOne({where: {id: id}, relations: ["friends"]});
		const friend = await this.userService.getUserQueryOne({where: {id: id2}, relations: ["friends"]});
		if (!user)
			throw "User can not be loaded";
        if (!friend)
            throw "Friend does not exist or can not be loaded";
		if (!user.friends)
			user.friends = [];
		if (!friend.friends)
			friend.friends = [];
		user.friends.push(friend);
		friend.friends.push(user);
		const result2 = await this.userService.saveUser(user);
		const result = await this.userService.saveUser(friend);
	}
	async getFriends(id: number) : Promise<UserEntity[]>
	{
		console.log(id);
		const user = await this.userService.getUserQuery({where: {id: id}, relations: ["friends"]});
		// const user = await this.UserRepository.findOne(id, {relations: ["friends"]});
		return user;
	}
	async remove(id: number, id2: number)
	{
		if (id == id2)
			throw "Cannot add yourself";
		const user = await this.userService.getUserQueryOne({where: {id: id}, relations: ["friends"]});
		const friend = await this.userService.getUserQueryOne({where: {id: id2}, relations: ["friends"]});
		if (!user)
			throw "User can not be loaded";
        if (!friend)
            throw "Friend does not exist or can not be loaded";
		if (!user.friends)
			user.friends = [];
		if (!friend.friends)
			friend.friends = [];
		const friendidx = user.friends.findIndex((x) => x.id == friend.id);
		const useridx = friend.friends.findIndex((x) => x.id == user.id);
		user.friends.splice(friendidx, 1);
		friend.friends.splice(useridx, 1);
		const result2 = await this.userService.saveUser(user);
		const result = await this.userService.saveUser(friend);
        console.log(result);
        console.log(result2);
	}

}
