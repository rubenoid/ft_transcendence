import { Controller, Get, Param } from "@nestjs/common";
import { ChatService } from "./chat.service";

@Controller("chat")
export class ChatController {
	constructor(private readonly chatService: ChatService) {}

	@Get("all")
	async returnAllChats() {
		return await this.chatService.getAllChats();
	}

	@Get("createRandomChat")
	async createRandomChat() {
		return await this.chatService.createChat();
	}

	@Get("createRandomMessage/:id")
	async createRandomMessage(@Param() param) {
		return await this.chatService.createRandMessage(param.id as number);
	}

	@Get("clear")
	async clearAll() {
		return await this.chatService.clear();
	}
}
