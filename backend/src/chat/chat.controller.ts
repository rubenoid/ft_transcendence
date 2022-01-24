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
	async returnMyChats(
		@Req() req: GuardedRequest,
		@Param("id") id: string,
	): Promise<ChatMessageEntity[]> {
		return await this.chatService.getMessages(parseInt(id), req.user.id);
	}

	@Get("get/:id")
	async getChatData(
		@Req() req: GuardedRequest,
		@Param("id") id: string,
	): Promise<ChatEntity> {
		return await this.chatService.getChatData(parseInt(id));
	}

	@Get("getDetailed/:id")
	async getDetailed(
		@Req() req: GuardedRequest,
		@Param("id") id: string,
	): Promise<ChatEntity> {
		return await this.chatService.getChatDataDetailed(parseInt(id));
	}

	@Post("enterProtected")
	async enterProtected(
		@Req() req: GuardedRequest,
		@Body("password") password: string,
		@Body("chatId") chatId: number,
	): Promise<boolean> {
		return this.chatService.enterProtected(password, chatId, req.user.id);
	}

	@Post("createNewChannel")
	async createNewChannel(
		@Req() req: GuardedRequest,
		@Body("name") name: string,
		@Body("userIds") userIds: number[],
		@Body("isPublic") isPublic: number,
		@Body("password") password: string,
	): Promise<number> {
		userIds.push(req.user.id);
		return await this.chatService.createChannel(
			name,
			userIds,
			isPublic,
			password,
		);
	}

	@Get("public")
	async getPublicChannels(): Promise<ChatEntity[]> {
		return await this.chatService.returnPublicChannels();
	}

	@Post("createNewChat")
	async createNewChat(
		@Req() req: GuardedRequest,
		@Body("ids") ids: number[],
	): Promise<number> {
		ids.push(req.user.id);
		return await this.chatService.createChat(ids);
	}

	@Get("clear")
	async clear(): Promise<void> {
		return await this.chatService.clear();
	}

	@Post("leave")
	async leave(
		@Req() req: GuardedRequest,
		@Body("chatId") chatId: number,
		@Body("idToRemove") idToRemove: number,
	): Promise<boolean> {
		return await this.chatService.leave(chatId, idToRemove, req.user.id);
	}

	@Post("updateChat")
	async updateChat(
		@Req() req: GuardedRequest,
		@Body("chatId") chatId: number,
		@Body("name") name: string,
		@Body("privacyLevel") privacyLevel: number,
		@Body("password") password: string,
	): Promise<boolean> {
		return await this.chatService.updateChat(chatId, req.user.id, name, privacyLevel, password);
	}

	@Post("addAdmin")
	async addAdmin(
		@Req() req: GuardedRequest,
		@Body("newAdminId") newAdminId: number,
		@Body("chatId") chatId: number,
	): Promise<boolean> {
		return await this.chatService.addAdmin(chatId, req.user.id, newAdminId);
	}

	@Post("addUser")
	async addUser(
		@Req() req: GuardedRequest,
		@Body("userId") userId: number,
		@Body("chatId") chatId: number,
	): Promise<void> {
		return await this.chatService.addUser(req.user.id, chatId, userId);
	}
	
}
