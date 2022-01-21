import { Inject, Injectable } from "@nestjs/common";
import { Repository, FindOneOptions } from "typeorm";
import { ChatEntity, ChatMessageEntity } from "./chat.entity";
import { UserService } from "src/user/user.service";
import { UserEntity } from "src/user/user.entity";
import { GuardedSocket } from "src/overloaded";
import { Socket, Server } from "socket.io";
import { ProtectorService } from '../protector/protector';

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
			relations: ["users", "messages"],
		});

		return chats;
	}

	async getMessages(id: number): Promise<ChatMessageEntity[]> {
		const data = await this.chatRepository.findOne({
			where: { id: id },
			relations: ["messages"],
		});
		if (data === undefined) return [];
		return data.messages;
	}

	async getChatData(id: number): Promise<ChatEntity> {
		const data = await this.chatRepository.findOne({
			where: { id: id },
			relations: ["users", "messages"],
		});

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
				where: { id: allChannels[i] },
				relations: ["users"],
			});

			if (channel.users.length == ids.length) {
				let k = 0;
				for (; k < ids.length; k++) {
					if (channel.users.findIndex((x) => x.id == ids[k]) == -1) break;
				}
				if (k == ids.length) return channel.id;
			}
		}
		return -1;
	}

	async returnPublicChannels() : Promise<ChatEntity[]> {
		console.log("HAHAHAHAHAHAHAHAHHAHAHAH");
		
		const data = await this.chatRepository.find({ where: {isPublic: true}});
		return data;
	}

	async createChannel(name: string, userIds: number[], isPublic: number, password: string): Promise<number> {
		const toadd = new ChatEntity();

		toadd.isPublic = isPublic == 0 ? false : true;
		toadd.name = name;
		toadd.users = [];
		toadd.password = await this.protectorService.hash(password);

		console.log("IDS:", userIds);
		for (let i = 0; i < userIds.length; i++) {
			const usertmp = await this.userService.getUserQueryOne({
				where: { id: userIds[i] },
			});
			if (!usertmp) throw "user not found???";
			toadd.users.push(usertmp);
		}
		const res = await this.chatRepository.save(toadd);

		return res.id;
	}

	async createChat(ids: number[]): Promise<number> {
		const found = await this.findChatMatch(ids);
		if (found != -1) return found;
		const toadd = new ChatEntity();

		toadd.name = '';
		toadd.password = "";
		toadd.isPublic = false;

		const users: UserEntity[] = [];

		for (let i = 0; i < ids.length; i++) {
			const usertmp = await this.userService.getUserQueryOne({
				where: { id: ids[i] },
			});
			if (!usertmp) throw "user not found???";
			users.push(usertmp);
			toadd.name += usertmp.userName;
			if (i + 1 != ids.length)
				toadd.name += ', ';
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
}
