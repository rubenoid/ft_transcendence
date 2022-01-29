import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { ChatEntity, ChatMessageEntity, MutedUserEntity } from "./chat.entity";
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

		private protectorService: ProtectorService,

		@Inject(forwardRef(() => UserService))
		private userService: UserService,
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
		for (let i = 0; i < chats.length; i++) {
			const element = chats[i];
			if (element.password) element["isProtected"] = true;
			delete element.password;
		}
		return chats;
	}

	async getMessages(id: number, userId: number): Promise<ChatMessageEntity[]> {
		const data = await this.chatRepository.findOne({
			where: { id: id },
			relations: ["users", "messages", "bannedUsers"],
		});
		if (data === undefined || data.bannedUsers.find((x) => x.id == userId))
			return [];

		if (
			data.password != "" &&
			data.users.find((x) => x.id == userId) == undefined
		)
			throw "protected";
		return data.messages;
	}

	async getChatData(id: number, userId: number): Promise<ChatEntity> {
		const data = await this.chatRepository.findOne({
			where: { id: id },
			relations: ["users"],
		});

		if (data.users.find((x) => x.id == userId) == undefined) {
			const user = await this.userService.getUserQueryOne({
				where: { id: userId },
			});
			data.users.push(user);
			await this.chatRepository.save(data);
		}

		if (data.password) {
			data["hasPassword"] = true;
		} else data["hasPassword"] = false;

		delete data.password;
		return data;
	}

	async getChatDataDetailed(id: number): Promise<ChatEntity> {
		const data = await this.chatRepository.findOne({
			where: { id: id },
			relations: ["users", "admins", "bannedUsers", "muted"],
		});

		if (data.password) {
			data["hasPassword"] = true;
		} else data["hasPassword"] = false;

		delete data.password;
		return data;
	}

	async findChatMatch(ids: number[]): Promise<number> {
		const allChannels: number[] = [];
		let user: UserEntity | undefined;
		console.log("ids", ids);
		// all user entities and push all the ids
		for (let i = 0; i < ids.length; i++) {
			user = await this.userService.getUserQueryOne({
				where: { id: ids[i] },
				relations: ["channels"],
			});
			for (let x = 0; x < user.channels.length; x++) {
				allChannels.push(user.channels[x].id);
			}
		}

		console.log("All channels:", allChannels);
		// comparing all private channels for a match
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
				console.log("channel found");
			}
		}
		return -1;
	}

	async returnPublicChannels(userId: number): Promise<ChatEntity[]> {
		const data = await this.chatRepository.find({
			where: { isPublic: true },
			relations: ["bannedUsers"],
		});

		for (let i = 0; i < data.length; i++) {
			const element = data[i];
			if (element.bannedUsers.find((x) => x.id == userId)) {
				data.splice(i, 1);
				continue;
			}
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
		toadd.muted = [];
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
		toadd.muted = [];

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
			relations: ["messages", "users", "muted"],
		});

		if (!chat) throw "no chat";

		const found = chat.muted.findIndex((x) => x.userTargetId == client.user.id);
		if (found != -1) {
			const foundEnt = chat.muted[found];
			if (Date.now() > foundEnt.endDate * 1000) {
				chat.muted.splice(found, 1);
			} else {
				return;
			}
		}
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
		if (!chat || chat.owner == -1) {
			throw "no chat to remove";
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
		if (chat.owner != userId || chat.owner == -1) {
			return false;
		}
		if (privacyLevel == 2) {
			chat.isPublic = true;
			chat.password = await this.protectorService.hash(password);
		} else {
			chat.isPublic = Boolean(privacyLevel);
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
		if (chat.owner != userId || chat.owner == -1) {
			return false;
		}
		const newAdmin = await this.userService.getUserQueryOne({
			where: { id: newAdminId },
		});
		chat.admins.push(newAdmin);
		await this.chatRepository.save(chat);
		return true;
	}

	async addUser(
		executerId: number,
		chatId: number,
		userId: number,
	): Promise<void> {
		const chat = await this.chatRepository.findOne({
			where: { id: chatId },
			relations: ["admins", "users", "bannedUsers"],
		});
		if (
			!chat ||
			chat.owner == -1 ||
			chat.admins.find((x) => x.id == executerId) == undefined ||
			chat.bannedUsers.find((x) => x.id == userId)
		)
			throw "Error in request";
		const user = await this.userService.getUserQueryOne({
			where: { id: userId },
		});

		if (!user || chat.users.find((x) => x.id == user.id))
			throw "User add error";

		chat.users.push(user);
		this.chatRepository.save(chat);
	}

	async banUser(
		executerId: number,
		chatId: number,
		userId: number,
	): Promise<void> {
		const chat = await this.chatRepository.findOne({
			where: { id: chatId },
			relations: ["admins", "users", "bannedUsers"],
		});
		if (
			!chat ||
			chat.owner == -1 ||
			chat.admins.find((x) => x.id == executerId) == undefined
		)
			throw "Error in request";
		await this.unmute(executerId, chatId, userId);
		if (userId == chat.owner) throw "cant ban owner";
		let idx = chat.admins.findIndex((x) => x.id == userId);
		if (idx != -1) chat.admins.splice(idx, 1);

		idx = chat.users.findIndex((x) => x.id == userId);
		if (idx != -1) chat.users.splice(idx, 1);

		chat.bannedUsers.push(
			await this.userService.getUserQueryOne({ where: { id: userId } }),
		);

		this.chatRepository.save(chat);
	}

	async unbanUser(
		executerId: number,
		chatId: number,
		userId: number,
	): Promise<void> {
		const chat = await this.chatRepository.findOne({
			where: { id: chatId },
			relations: ["admins", "users", "bannedUsers"],
		});
		if (
			!chat ||
			chat.owner == -1 ||
			chat.admins.find((x) => x.id == executerId) == undefined
		)
			throw "Error in request";
		const idx = chat.bannedUsers.findIndex((x) => x.id == userId);

		if (idx == -1) throw "no user found";
		chat.bannedUsers.splice(idx, 1);
		chat.users.push(
			await this.userService.getUserQueryOne({ where: { id: userId } }),
		);

		this.chatRepository.save(chat);
	}

	async muteUser(
		executerId: number,
		userId: number,
		chatId: number,
	): Promise<void> {
		const chat = await this.chatRepository.findOne({
			where: { id: chatId },
			relations: ["admins", "users", "bannedUsers", "muted"],
		});

		if (
			!chat ||
			chat.owner == -1 ||
			chat.admins.find((x) => x.id == executerId) == undefined ||
			chat.muted.find((x) => x.userTargetId == userId)
		) {
			console.log("Error with req");
			return;
		}
		const toAdd = new MutedUserEntity();
		toAdd.endDate = Math.floor((Date.now() + 600000) / 1000);
		toAdd.userTargetId = userId;
		toAdd.target = chat;
		chat.muted.push(toAdd);
		await this.chatRepository.save(chat);
	}

	async unmute(
		executerId: number,
		chatId: number,
		userId: number,
	): Promise<void> {
		const chat = await this.chatRepository.findOne({
			where: { id: chatId },
			relations: ["admins", "users", "muted"],
		});
		if (
			!chat ||
			chat.owner == -1 ||
			chat.admins.find((x) => x.id == executerId) == undefined
		) {
			console.log("Error with req");
			return;
		}
		let i: number;
		if ((i = chat.muted.findIndex((x) => x.userTargetId == userId)) != -1) {
			chat.muted.splice(i, 1);
			await this.chatRepository.save(chat);
		}
	}
}
