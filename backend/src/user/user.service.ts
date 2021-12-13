import { Inject, Injectable } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';


@Injectable()
export class UserService {

	constructor (
		@Inject('USER_REPOSITORY')
		private UserRepository: Repository<UserEntity>
		) {}
	async getUser(id: number): Promise<UserEntity[]>
	{
		const User = await this.UserRepository.find({ where: { id: id } });
		if (User.length === 0)
			throw "user not found";
		return User;
	}

	async addUser()
	{
		console.log("hallo");
		let newUser: UserEntity = new UserEntity();

		newUser.firstName = "i dont know";
		newUser.lastName = "hallo";
		newUser.userName = "woohoo";
		newUser.rating = 10000;
		newUser.wins = 99;
		newUser.losses = 1;
		await this.UserRepository.save(newUser);
	}

	async deleteUser(id: number): Promise<boolean>
	{
		const result = await this.UserRepository.delete(id);
		if (result.affected)
			return true;
		return false;
	}
	async changeFirstName(id: number): Promise<boolean>
	{
		const user = await this.UserRepository.find({ where: { id: id } });
		var oldfirstname = user[0].firstName;
		user[0].firstName = "CHANGED";
		const result = await this.UserRepository.save(user);
		console.log(result);
		console.log(typeof result);
		if (oldfirstname == user[0].firstName)
			return false;
		return true;
	}

	async addFriend(id: number, id2: number) //: Promise<bool>
	{
		var friendly: UserEntity = new UserEntity();
		const user = await this.UserRepository.find({ where: { id: id } });
		const friend = await this.UserRepository.find({ where: { id: id2 } });
		friendly = friend[0];
		if (!user[0].friends)
			user[0].friends = [];
		user[0].friends.push(friendly);
		console.log("user[0]:");
		console.log(user[0]);
		const result = await this.UserRepository.save(user);
		const result2 = await this.UserRepository.save(user[0]);
		// if (result.affected)
		// 	return true;
		// return false;
	}

	async getFriends(id: number) : Promise<UserEntity[]>
	{
		console.log("id: getFriends?");
		console.log(id);
		const user = await this.UserRepository.findOne(id, {relations: ['friends']});
		var allFriends = user.friends;
		console.log("user[0]: getFriends?");
		console.log(user[0]);
		console.log(user);
		console.log("allFriends: getFriends?");
		console.log(allFriends);
		return allFriends
	}

	async getAllUsers(): Promise<UserEntity[]>
	{
		const User = await this.UserRepository.find();
		if (User.length === 0)
			throw "user not found";
		return User;
	}
}
