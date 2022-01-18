import { Controller, Get, Param, Post, Req, Body } from "@nestjs/common";
import { ChatEntity, ChatMessageEntity } from "./chat.entity";
import { ChatService } from "./chat.service";
import { GuardedRequest } from "../overloaded";

@Controller("chat")
export class ChatController {
	constructor(private readonly chatService: ChatService) {}

	@Get("all")
	async returnAllChats(): Promise<ChatEntity[]> {
		return await this.chatService.getAllChats();
	}

	@Get("messages/:id")
	async returnMyChats(@Param("id") id: string): Promise<ChatMessageEntity[]> {
		return await this.chatService.getMessages(parseInt(id));
	}

	@Post("addChatMessage")
	async addChatMessage(
		@Req() req: GuardedRequest,
		@Body("data") data: string,
		@Body("chatId") chatId: number,
	): Promise<void> {
		return await this.chatService.addChatMessage(req.user.id, data, chatId);
	}

	@Post("createNewChat")
	async createNewChat(
		@Req() req: GuardedRequest,
		@Body("ids") ids: number[],
	): Promise<number> {
		ids.push(req.user.id);
		return await this.chatService.createChat(ids);
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
