import { Controller, Get, Param } from "@nestjs/common";
import { ChatEntity } from "./chat.entity";
import { ChatService } from "./chat.service";

@Controller("chat")
export class ChatController {
	constructor(private readonly chatService: ChatService) {}

	@Get("all")
	async returnAllChats(): Promise<ChatEntity[]> {
		return await this.chatService.getAllChats();
	}

	@Get("createRandomChat")
	async createRandomChat(): Promise<void> {
		return await this.chatService.createChat();
	}

	@Get("createRandomMessage/:id")
	async createRandomMessage(@Param("id") id: string): Promise<void> {
		return await this.chatService.createRandMessage(parseInt(id));
	}

	@Get("clear")
	async clearAll(): Promise<void> {
		return await this.chatService.clear();
	}
}
