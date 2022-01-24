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
		return await this.chatService.getChatData(parseInt(id), req.user.id);
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

	@Get("isProtected/:id")
	async isProtected(@Param("id") id: string): Promise<boolean> {
		return await this.chatService.isProtected(parseInt(id));
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

	@Post("changepw")
	async changepw(
		@Req() req: GuardedRequest,
		@Body("password") password: string,
		@Body("chatId") chatId: number,
	): Promise<boolean> {
		return this.chatService.changepw(password, chatId, req.user.id);
	}

	@Post("leave")
	async leave(
		@Req() req: GuardedRequest,
		@Body("chatId") chatId: number,
		@Body("idToRemove") idToRemove: number,
	): Promise<boolean> {
		return await this.chatService.leave(chatId, idToRemove, req.user.id);
	}

	@Post("changeVis")
	async changeVis(
		@Req() req: GuardedRequest,
		@Body("chatId") chatId: number,
		@Body("newVis") newVis: string,
		@Body("newpw") newpw: string,
	): Promise<boolean> {
		return await this.chatService.changeVis(chatId, req.user.id, newVis, newpw);
	}

	@Post("addAdmin")
	async addAdmin(
		@Req() req: GuardedRequest,
		@Body("newAdminId") newAdminId: number,
		@Body("chatId") chatId: number,
	): Promise<boolean> {
		return await this.chatService.addAdmin(chatId, req.user.id, newAdminId);
	}
}
