import { Inject, Injectable } from "@nestjs/common";
import { Repository, FindOneOptions } from "typeorm";
import { ChatEntity, ChatMessageEntity } from "./chat.entity";
import { UserService } from "src/user/user.service";
import { Socket, Server } from "socket.io";


let kvArray = new Map<number, string>();

interface Message {
    from: number,
    room: number,
    data: string,
}

@Injectable()
export class ChatService {
	constructor(
		@Inject("CHAT_REPOSITORY")
		private chatRepository: Repository<ChatEntity>,

		private userService: UserService,
	) {}

	async addConnection(userId: number, socketID: string)
	{
		kvArray.set(userId, socketID);
		console.log("addConnect")
		console.log(kvArray);
	}

	async getAllChats(): Promise<ChatEntity[]> {
		const chats = await this.chatRepository.find({
			relations: ["users", "messages"],
		});

		return chats;
	}

	async getmyChats(id): Promise<ChatEntity[]> {
		const chats = await this.chatRepository.find({
			where: {id: id},
			relations: ["users", "messages"],
		});

		return chats;
	}

	async createChat(): Promise<void> {
		const toadd = new ChatEntity();

		toadd.name = "Oscar, Ruben";
		toadd.password = "aa";

		const users = await this.userService.getUsers();

		if (users.length < 2) throw "kkr weinig users";
		toadd.users = [users[0], users[1]];
		toadd.messages = [];

		this.chatRepository.save(toadd);
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

	async emitMessage(server: Server, room: number, message: Message ): Promise<void> {
		const otheruser = kvArray.get(message.room);
		if (otheruser == undefined)
		{
			console.log("Other user not online");
			return;
		}
		console.log("emmiting to ", otheruser, " with message ", message.data);
		server.to(otheruser).emit("newMessage", message.data);
	}
}
