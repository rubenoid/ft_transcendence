import { Inject, Injectable } from "@nestjs/common";
import { Repository, FindOneOptions } from "typeorm";
import { ChatEntity, ChatMessageEntity } from "./chat.entity";
import { UserService } from "src/user/user.service";
import { UserEntity } from "src/user/user.entity";
import { GuardedSocket } from "src/overloaded";
import { Socket, Server } from "socket.io";
import { ProtectorService } from "../protector/protector";

@Injectable()
export class ChatService {
	constructor(
		@Inject("CHAT_REPOSITORY")
		private chatRepository: Repository<ChatEntity>,

		@Inject("CHAT_MESSAGE_REPOSITORY")
		private chatMessageRepository: Repository<ChatMessageEntity>,

		private userService: UserService,

		private protectorService: ProtectorService,
	) {}

	clients: GuardedSocket[] = [];

	handleConnect(client: GuardedSocket): void {
		this.clients.push(client);
	}

	handleDisconnect(client: Socket): void {
		const res = this.clients.findIndex((x) => x.id == client.id);

		console.log("User disconnected");
		if (res >= 0) this.clients.splice(res, 1);
	}

	async getAllChats(): Promise<ChatEntity[]> {
		const chats = await this.chatRepository.find({
			relations: ["users", "messages", "admins"],
		});

		return chats;
	}

	async getMessages(id: number, userId: number): Promise<ChatMessageEntity[]> {
		const data = await this.chatRepository.findOne({
			where: { id: id },
			relations: ["users", "messages"],
		});
		if (data === undefined) return [];

		if (
			data.password != "" &&
			data.users.find((x) => x.id == userId) == undefined
		)
			throw "protected";
		return data.messages;
	}

	async getChatData(id: number): Promise<ChatEntity> {
		const data = await this.chatRepository.findOne({
			where: { id: id },
		});

		if (data.password)
		{
			data["hasPassword"] = true;
		}
		else data["hasPassword"] = false;
			
		delete data.password;
		return data;
	}

	async getChatDataDetailed(id: number): Promise<ChatEntity> {
		const data = await this.chatRepository.findOne({
			where: { id: id },
			relations: ["users", "admins"],
		});

		if (data.password)
		{
			data["hasPassword"] = true;
		}
		else data["hasPassword"] = false;
			
		delete data.password;
		return data;
	}

	async findChatMatch(ids: number[]): Promise<number> {
		const allChannels: number[] = [];
		const users: UserEntity[] = [];
		for (let i = 0; i < ids.length; i++) {
			users[i] = await this.userService.getUserQueryOne({
				where: { id: ids[0] },
				relations: ["channels"],
			});
		}
		for (let i = 0; i < users.length; i++) {
			for (let x = 0; x < users[i].channels.length; x++) {
				allChannels.push(users[i].channels[x].id);
			}
		}

		for (let i = 0; i < allChannels.length; i++) {
			const channel: ChatEntity = await this.chatRepository.findOne({
				where: { id: allChannels[i], isPublic: false },
				relations: ["users"],
			});

			if (channel && channel.users.length == ids.length) {
				let k = 0;
				for (; k < ids.length; k++) {
					if (channel.users.findIndex((x) => x.id == ids[k]) == -1) break;
				}
				if (k == ids.length) return channel.id;
			}
		}
		return -1;
	}

	async returnPublicChannels(): Promise<ChatEntity[]> {
		const data = await this.chatRepository.find({ where: { isPublic: true } });

		for (let i = 0; i < data.length; i++) {
			const element = data[i];
			if (element.password) element["isProtected"] = true;
			delete element.password;
		}
		return data;
	}

	async createChannel(
		name: string,
		userIds: number[],
		isPublic: number,
		password: string,
	): Promise<number> {
		const toadd = new ChatEntity();

		toadd.isPublic = isPublic == 1 ? false : true;
		toadd.name = name;
		toadd.users = [];
		if (password != "") {
			toadd.password = await this.protectorService.hash(password);
		} else toadd.password = "";
		console.log("IDS:", userIds);
		let usertmp: UserEntity;
		for (let i = 0; i < userIds.length; i++) {
			usertmp = await this.userService.getUserQueryOne({
				where: { id: userIds[i] },
			});
			if (!usertmp) throw "user not found???";
			toadd.users.push(usertmp);
		}
		toadd.owner = userIds[userIds.length - 1];
		toadd.admins = [];
		toadd.admins.push(usertmp);
		const res = await this.chatRepository.save(toadd);
		return res.id;
	}

	async createChat(ids: number[]): Promise<number> {
		const found = await this.findChatMatch(ids);
		if (found != -1) return found;
		const toadd = new ChatEntity();

		toadd.name = "";
		toadd.password = "";
		toadd.isPublic = false;
		toadd.owner = -1;

		const users: UserEntity[] = [];

		for (let i = 0; i < ids.length; i++) {
			const usertmp = await this.userService.getUserQueryOne({
				where: { id: ids[i] },
			});
			if (!usertmp) throw "user not found???";
			users.push(usertmp);
			toadd.name += usertmp.userName;
			if (i + 1 != ids.length) toadd.name += ", ";
		}

		if (users.length < 2) throw "kkr weinig users";
		toadd.users = users;
		toadd.messages = [];

		const res = await this.chatRepository.save(toadd);

		return res.id;
	}

	async addChatMessage(
		server: Server,
		client: GuardedSocket,
		data: string,
		chatId: number,
	): Promise<void> {
		const chat = await this.chatRepository.findOne({
			where: { id: chatId },
			relations: ["messages", "users"],
		});

		if (!chat) throw "no chat";

		const toadd = new ChatMessageEntity();

		toadd.data = data;
		toadd.senderId = client.user.id;

		chat.messages.push(toadd);

		for (let i = 0; i < this.clients.length; i++) {
			const e = this.clients[i];
			console.log(e.user.id, e.id);
		}

		for (let i = 0; i < this.clients.length; i++) {
			const found = chat.users.find((x) => x.id == this.clients[i].user.id);
			if (found) {
				console.log("Yes!");
				server.to(this.clients[i].id).emit("newMessage", {
					data: data,
					senderId: client.user.id,
					channelId: chatId,
				});
			}
		}

		await this.chatRepository.save(chat);
	}

	async clear(): Promise<void> {
		const messages = await this.chatMessageRepository.find();
		await this.chatMessageRepository.remove(messages);
		const chats = await this.chatRepository.find({ relations: ["messages"] });
		await this.chatRepository.remove(chats);
	}

	async clearbyId(id: number): Promise<void> {
		const chat = await this.chatRepository.findOne({
			where: { id: id },
			relations: ["messages"],
		});
		const messages: ChatMessageEntity[] = chat.messages;
		await this.chatMessageRepository.remove(messages);
		await this.chatRepository.remove(chat);
	}

	async enterProtected(
		password: string,
		chatId: number,
		userId: number,
	): Promise<boolean> {
		const chat = await this.chatRepository.findOne({
			where: { id: chatId },
			relations: ["users"],
		});

		const ret: boolean = await this.protectorService.compare(
			password,
			chat.password,
		);
		if (ret == true) {
			const user = await this.userService.getUserQueryOne({
				where: { id: userId },
			});
			if (!user) throw "exception no user to enter protected";
			chat.users.push(user);
			await this.chatRepository.save(chat);
			return true;
		}
		return false;
	}

	async leave(
		chatId: number,
		idToRemove: number,
		executer: number,
	): Promise<boolean> {
		const chat = await this.chatRepository.findOne({
			where: { id: chatId },
			relations: ["users", "admins"],
		});
		if (!chat) {
			throw "no chat to remove";
		}
		if (chat.isPublic == false) {
			return false;
		}
		if (
			executer == idToRemove ||
			executer == chat.owner ||
			chat.admins.findIndex((e) => e.id == executer) != -1
		) {
			let indexToRemove = chat.users.findIndex((e) => e.id == idToRemove); // returns -1 if not found
			if (indexToRemove < 0)
				throw "Can not remove user from chat, because user is not in chat";
			chat.users.splice(indexToRemove, 1);
			if (!chat.users.length) {
				this.clearbyId(chatId);
				return true;
			}
			if (
				(indexToRemove = chat.admins.findIndex((e) => e.id == idToRemove)) != -1
			) {
				chat.admins.splice(indexToRemove, 1);
			}
			if (idToRemove == chat.owner) {
				if (chat.admins.length) {
					chat.owner = chat.admins[0].id;
				} else {
					chat.owner = chat.users[0].id;
				}
			}
			await this.chatRepository.save(chat);
			return true;
		}
		console.log("no permissions to remove user from chat");
		return false;
	}

	async updateChat(
		chatId: number,
		userId: number,
		name: string,
		privacyLevel: number,
		password: string,
	): Promise<boolean> {
		const chat = await this.chatRepository.findOne({
			where: { id: chatId },
		});
		chat.name = name;
		if (chat.owner != userId) {
			return false;
		}
		if (privacyLevel == 2)
		{
			chat.isPublic = true;
			chat.password = await this.protectorService.hash(password);
		}
		else
		{
			chat.isPublic = !Boolean(privacyLevel);
			chat.password = "";
		}
		await this.chatRepository.save(chat);
		return false;
	}

	async addAdmin(
		chatId: number,
		userId: number,
		newAdminId: number,
	): Promise<boolean> {
		const chat = await this.chatRepository.findOne({
			where: { id: chatId },
			relations: ["admins"],
		});
		if (chat.owner != userId) {
			return false;
		}
		const newAdmin = await this.userService.getUserQueryOne({
			where: { id: newAdminId },
		});
		chat.admins.push(newAdmin);
		await this.chatRepository.save(chat);
		return true;
	}
}
