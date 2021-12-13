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
		const user = await this.UserRepository.findOne(id);
		var oldfirstname = user.firstName;
		user.firstName = "CHANGED";
		const result = await this.UserRepository.save(user);
		if (oldfirstname == user[0].firstName)
			return false;
		return true;
	}

	async addFriend(id: number, id2: number) //: Promise<bool>
	{
		if (id == id2)
			throw "Cannot add yourself";
		const user = await this.UserRepository.findOne(id, {relations: ["friends"]});
		const friend = await this.UserRepository.findOne(id2, {relations: ["friends"]});
		if (!user || !friend)
			throw "friend or user not loaded";
		if (!user.friends)
			user.friends = [];
		if (!friend.friends)
			friend.friends = [];
		user.friends.push(friend);
		friend.friends.push(user);
		const result2 = await this.UserRepository.save(user);
		const result = await this.UserRepository.save(friend);
	}

	async getFriends(id: number) : Promise<UserEntity>
	{
		console.log(id);
		const user = await this.UserRepository.findOne(id, {relations: ["friends"]});
		return user;
		// var allFriends = user.friends;
		// return allFriends
	}

	async getAllUsers(): Promise<UserEntity[]>
	{
		const User = await this.UserRepository.find();
		if (User.length === 0)
			throw "user not found";
		return User;
	}

	async deleteAllUsers() {
		await this.UserRepository.remove(await this.getAllUsers());
	}
}
