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

	@Get("get/:id")
	async getChatData(@Param("id") id: string): Promise<ChatEntity> {
		return await this.chatService.getChatData(parseInt(id));
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
