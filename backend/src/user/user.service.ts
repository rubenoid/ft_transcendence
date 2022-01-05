import { Inject, Injectable } from "@nestjs/common";
import { UserEntity } from "./user.entity";
import { Repository, FindOneOptions } from "typeorm";

let currentId = 0;
@Injectable()
export class UserService {
	constructor(
		@Inject("USER_REPOSITORY")
		private UserRepository: Repository<UserEntity>,
	) {}
	async getUser(toFind: number): Promise<UserEntity> {
		const User = await this.UserRepository.findOne({ where: { id: toFind } });
		// if (User === undefined)
		// 	throw "User not found";
		return User;
	}

	async getUserAvatarById(toFind: number): Promise<string> {
		const User = await this.UserRepository.findOne({ where: { id: toFind } });
		if (User === undefined) throw "User not found";
		return User.avatar;
	}

	async getUserQuery(query: FindOneOptions<UserEntity>): Promise<UserEntity[]> {
		const User = await this.UserRepository.find(query);
		if (User.length === 0) throw "User not found";
		return User;
	}

	async getUserQueryOne(
		query: FindOneOptions<UserEntity>,
	): Promise<UserEntity> {
		const User = await this.UserRepository.findOne(query);
		if (!User) throw "User not found getUserQueryOne";
		return User;
	}

	async saveUser(user: UserEntity): Promise<void> {
		await this.UserRepository.save(user);
	}

	async addUser(): Promise<void> {
		const newUser: UserEntity = new UserEntity();
		newUser.id = currentId++;
		newUser.firstName = "i dont know";
		newUser.lastName = "hallo";
		newUser.userName = "woohoo";
		newUser.avatar = "img/test.jpeg";
		newUser.rating = 10000;
		newUser.wins = 99;
		newUser.losses = 1;
		newUser.blockedBy = [];
		newUser.blockedUsers = [];

		await this.UserRepository.save(newUser);
	}

	async addwithDetails(
		id: number,
		username: string,
		firstname: string,
		lastname: string,
	): Promise<void> {
		console.log(
			"start here" + id + "username:" + username + "firstname:" + firstname,
			+"lastname" + lastname,
		);
		const newUser: UserEntity = new UserEntity();
		newUser.id = id;
		newUser.firstName = firstname;
		newUser.lastName = lastname;
		newUser.userName = username;
		newUser.avatar = "img/test.jpeg";
		newUser.rating = 10000;
		newUser.wins = 99;
		newUser.losses = 1;
		newUser.blockedBy = [];
		newUser.blockedUsers = [];
		console.log("end here");
		console.log("CREATED AS ID" + id);
		await this.UserRepository.save(newUser);
	}

	async getUsers(): Promise<UserEntity[]> {
		return await this.UserRepository.find();
	}

	async deleteUser(id: number): Promise<boolean> {
		const result = await this.UserRepository.delete(id);
		if (result.affected) return true;
		return false;
	}

	async getAll(): Promise<UserEntity[]> {
		const User = await this.UserRepository.find({
			relations: ["friends", "matches"],
		});
		if (User.length === 0) throw "user not found";
		return User;
	}

	async deleteAll(): Promise<void> {
		await this.UserRepository.remove(await this.getAll());
	}

	async insert(
		firstName: string,
		lastName: string,
		userName: string,
	): Promise<number> {
		const newUser: UserEntity = new UserEntity();
		newUser.id = currentId++;
		newUser.firstName = firstName;
		newUser.lastName = lastName;
		newUser.userName = userName;
		newUser.rating = 1500;
		newUser.wins = 0;
		newUser.losses = 0;
		newUser.blockedBy = [];
		newUser.blockedUsers = [];
		await this.UserRepository.save(newUser);
		return newUser.id;
	}

	async update(
		id: number,
		firstName: string,
		lastName: string,
		userName: string,
	): Promise<number> {
		const user = await this.getUserQueryOne({ where: { id: id } });
		user.firstName = firstName;
		user.lastName = lastName;
		user.userName = userName;
		await this.UserRepository.save(user);
		return user.id;
	}
	async getUserByName(username: string): Promise<UserEntity> {
		const User = await this.UserRepository.findOne({
			where: { userName: username },
		});
		// if (User === undefined)
		// 	throw "User not found findOne";
		return User;
	}
}
