import { Injectable, Inject, forwardRef } from "@nestjs/common";
import { UserEntity } from "./user.entity";
import { Repository, FindOneOptions } from "typeorm";
import { writeFile } from "fs";
import { MatchEntity } from "src/match/match.entity";
import { GuardedSocket } from "src/overloaded";
import { Server } from "socket.io";
import { ChatEntity } from "src/chat/chat.entity"
import { ChatService } from "src/chat/chat.service"

let currentId = 0;

const userStatus = new Map<number, { status: string; client: GuardedSocket }>();

@Injectable()
export class UserService {
	constructor(
		@Inject("USER_REPOSITORY")
		private UserRepository: Repository<UserEntity>,

		@Inject(forwardRef(() => ChatService))
		private chatService: ChatService,
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
		if (User.length === 0) throw "User not found getUserQuery";
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
		newUser.firstName = "iDonKnow";
		newUser.lastName = "hallo";
		newUser.userName = "abcdefghijklmnopqrstuvwxyz".charAt(currentId);
		newUser.avatar = "img/test.jpeg";
		newUser.rating = 10000;
		newUser.wins = 0;
		newUser.losses = 0;
		newUser.blockedBy = [];
		newUser.blockedUsers = [];
		newUser.registered = false;
		newUser.twoFactorSecret = "";
		newUser.twoFactorvalid = false;
		newUser.logedin = false;
		await this.UserRepository.save(newUser);
	}

	async addwithDetails(
		id: number,
		username: string,
		firstname: string,
		lastname: string,
		registered: boolean,
	): Promise<void> {
		const newUser: UserEntity = new UserEntity();
		newUser.id = id;
		newUser.firstName = firstname;
		newUser.lastName = lastname;
		newUser.userName = username;
		newUser.avatar = "img/test.jpeg";
		newUser.rating = 10000;
		newUser.wins = 0;
		newUser.losses = 0;
		newUser.friends = [];
		newUser.blockedBy = [];
		newUser.blockedUsers = [];
		newUser.registered = registered;
		newUser.twoFactorSecret = "";
		newUser.twoFactorvalid = false;
		newUser.logedin = false;
		await this.UserRepository.save(newUser);
		console.log("end add w details");
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

	async getAllUsersNRelations(): Promise<UserEntity[]> {
		const User = await this.UserRepository.find({
			relations: [
				"friends",
				"matches",
				"blockedUsers",
				"blockedBy",
				"channels",
			],
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
		newUser.friends = [];
		newUser.blockedBy = [];
		newUser.blockedUsers = [];
		newUser.logedin = false; //?
		await this.UserRepository.save(newUser);
		return newUser.id;
	}

	async update(
		id: number,
		userName: string,
		firstName: string,
		lastName: string,
		twoFASecret?: string
	): Promise<number> {
		const user = await this.getUserQueryOne({ where: { id: id } });
		user.firstName = firstName;
		user.lastName = lastName;
		user.userName = userName;
		user.registered = true;
		if (twoFASecret && twoFASecret != "")
			user.twoFactorSecret = twoFASecret;
			
		await this.UserRepository.save(user);
		console.log("finished update with id:", id, "userName", userName);
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

	async saveAvatar(id: number, file: Express.Multer.File): Promise<void> {
		const path = `./static/img/${id}.png`;
		await writeFile(path, file.buffer, (data) => {
			console.log("saved succesfuli", data);
		});
		const user = await this.getUserQueryOne({
			where: { id: id },
		});
		user.avatar = "img/" + id + ".png";
		await this.saveUser(user);
	}

	async userStatusById(toFind: number): Promise<string> {
		const user = userStatus.get(toFind);
		if (!user) return "offline";
		return user.status;
	}

	async updateUserStatus(
		server: Server,
		client: GuardedSocket,
		type: string,
	): Promise<void> {
		if (client.user) {
			const data = userStatus.get(client.user.id);

			console.log("Data of client" + client.user.id + " " + data);

			userStatus.set(client.user.id, { status: type, client: client });

			server.emit("userUpdate", { id: client.user.id, status: type });
		}
	}

	async getAllStatus(): Promise<object[]> {
		const tosend = [];

		userStatus.forEach(
			(val: { status: string; client: GuardedSocket }, key: number) => {
				tosend.push({ id: key, status: val.status });
			},
		);
		return tosend;
	}

	async getMyChats(userId: number): Promise<ChatEntity[]> {
		const data: ChatEntity[] = (
			await this.getUserQueryOne({
				where: { id: userId },
				relations: ["channels"],
			})
		).channels;

		for (let i = 0; i < data.length; i++) {
			const chat: ChatEntity = await this.chatService.getChatDataDetailed(data[i].id);
			const element = data[i];
			if (chat.bannedUsers.find(x => x.id == userId))
			{
				data.splice(i, 1);
				continue;
			}
			if (element.password) element["isProtected"] = true;
			delete element.password;
		}
		return data;
	}
}
