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
}
