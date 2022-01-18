import { Inject, Injectable } from "@nestjs/common";
import { Repository, FindOneOptions } from "typeorm";
import { ChatEntity, ChatMessageEntity } from "./chat.entity";
import { UserService } from "src/user/user.service";
import { UserEntity } from "src/user/user.entity";

@Injectable()
export class ChatService {
	constructor(
		@Inject("CHAT_REPOSITORY")
		private chatRepository: Repository<ChatEntity>,

		private userService: UserService,
	) {}

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

	async createChat(ids: number[]): Promise<number> {
		const toadd = new ChatEntity();

		toadd.name = "Unnamed Chat";
		toadd.password = "";

		const users: UserEntity[] = [];

		for (let i = 0; i < ids.length; i++) {
			const usertmp = await this.userService.getUserQueryOne({
				where: { id: ids[i] },
			});
			if (!usertmp) throw "user not found???";
			users.push(usertmp);
		}

		if (users.length < 2) throw "kkr weinig users";
		toadd.users = users;
		toadd.messages = [];

		const res = await this.chatRepository.save(toadd);

		return res.id;
	}

	async addChatMessage(
		userId: number,
		data: string,
		chatId: number,
	): Promise<void> {
		const chat = await this.chatRepository.findOne({
			where: { id: chatId },
			relations: ["messages"],
		});

		if (!chat) throw "no chat";

		const toadd = new ChatMessageEntity();

		toadd.data = data;
		toadd.senderId = userId;

		chat.messages.push(toadd);

		await this.chatRepository.save(chat);
	}

	async createRandMessage(id: number): Promise<void> {
		const chat = await this.chatRepository.findOne(id);

		console.log("1");

		if (!chat) throw "no chat";

		console.log("2");

		if (!chat.messages) chat.messages = [];

		console.log(chat);

		const toadd = new ChatMessageEntity();

		toadd.data = "hallo!!";

		toadd.senderId = 0;

		chat.messages.push(toadd);
		await this.chatRepository.save(chat);
	}

	async clear(): Promise<void> {
		const chats = await this.chatRepository.find();

		for (let i = 0; i < chats.length; i++) {
			const e = chats[i];
			await this.chatRepository.remove(e);
		}
	}
}
