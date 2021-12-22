import { Inject, Injectable } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { Repository, FindOneOptions} from 'typeorm';


@Injectable()
export class UserService {

	constructor (
		@Inject('USER_REPOSITORY')
		private UserRepository: Repository<UserEntity>
		) {}
	async getUser(toFind: number): Promise<UserEntity>
	{
		const User = await this.UserRepository.findOne({ where: { id: toFind } });
		if (User === undefined)
			throw "User not found";
		return User;
	}

	async getUserQuery(query: FindOneOptions<UserEntity>): Promise<UserEntity[]>
	{
		const User = await this.UserRepository.find(query);
		if (User.length === 0)
			throw "User not found";
		return User;
	}

	async getUserQueryOne(query: FindOneOptions<UserEntity>): Promise<UserEntity>
	{
		const User = await this.UserRepository.findOne(query);
		if (!User)
			throw "User not found getUserQueryOne";
		return User;
	}

	async findByLogin(toFind: string): Promise<UserEntity>
	{
		const User = await this.UserRepository.findOne({ where: { userName: toFind } });;
		if (!User)
			throw "User not found getUserQueryOne";
		return User;
	}

	async findByPayload({ username }: any): Promise<UserEntity> {
		return await this.UserRepository.findOne({ where: { username } });
	  }

	async saveUser(user: UserEntity): Promise<void>
	{
		await this.UserRepository.save(user);
	}

	async addUser()
	{
		let newUser: UserEntity = new UserEntity();
		newUser.firstName = "i dont know";
		newUser.lastName = "hallo";
		newUser.userName = "woohoo";
		newUser.rating = 10000;
		newUser.wins = 99;
		newUser.losses = 1;
		newUser.blockedBy = [];
		newUser.blockedUsers = [];

		await this.UserRepository.save(newUser);
	}
	async addwithDetails(username: string, firstname: string, lastname: string)
	{
		let newUser: UserEntity = new UserEntity();
		newUser.firstName = firstname;
		newUser.lastName = lastname;
		newUser.userName = username;
		newUser.rating = 10000;
		newUser.wins = 99;
		newUser.losses = 1;
		newUser.blockedBy = [];
		newUser.blockedUsers = [];

		await this.UserRepository.save(newUser);
	}

	async getUsers()
	{
		return await this.UserRepository.find();
	}

	async deleteUser(id: number): Promise<boolean>
	{
		const result = await this.UserRepository.delete(id);
		if (result.affected)
			return true;
		return false;
	}

	async getAll(): Promise<UserEntity[]>
	{
		const User = await this.UserRepository.find();
		if (User.length === 0)
			throw "user not found";
		return User;
	}

	async deleteAll() {
		await this.UserRepository.remove(await this.getAll());
	}

	async insert(firstName: string, lastName: string, userName: string)
	{
		let newUser: UserEntity = new UserEntity();
		newUser.firstName = firstName;
		newUser.lastName = lastName;
		newUser.userName = userName;
		newUser.rating = 1500;
		newUser.wins = 0;
		newUser.losses = 0;
		newUser.blockedBy = [];
		newUser.blockedUsers= [];
		await this.UserRepository.save(newUser);
		return newUser.id;
	}

	async update(id: number, firstName: string, lastName: string, userName: string)
	{
		let user = await this.getUserQueryOne({where: {id: id}});
		user.firstName = firstName;
		user.lastName = lastName;
		user.userName = userName;	
		await this.UserRepository.save(user);		
		return user.id;	

	}
}
