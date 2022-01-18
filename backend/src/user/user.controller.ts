import {
	Controller,
	Get,
	Post,
	Put,
	Body,
	Injectable,
	Param,
	Req,
} from "@nestjs/common";
import { GuardedRequest } from "src/overloaded";
import { UserEntity } from "./user.entity";
import { UserService } from "./user.service";
import { ChatEntity } from "../chat/chat.entity";

@Controller("user")
export class UserController {
	constructor(private readonly userService: UserService) {}
	@Get("getAll")
	async getAll(): Promise<UserEntity[]> {
		return await this.userService.getAll();
	}
	@Get("get/:id")
	async getUserById(@Param("id") id: string): Promise<UserEntity> {
		return await this.userService.getUser(parseInt(id));
	}
	@Get("me")
	async getme(@Req() req: GuardedRequest): Promise<UserEntity> {
		return await this.userService.getUser(req.user.id as number);
	}

	@Get("me/chats")
	async getMyChats(@Req() req: GuardedRequest): Promise<ChatEntity[]> {
		return (
			await this.userService.getUserQueryOne({
				where: { id: req.user.id },
				relations: ["channels"],
			})
		).channels;
	}

	@Get("getByUserName/:username")
	async getUserByUsername(
		@Param("username") username: string,
	): Promise<UserEntity> {
		return await this.userService.getUserByName(username);
	}

	@Get("getAvatar/:id")
	async getUserAvatarById(@Param("id") id: string): Promise<string> {
		return await this.userService.getUserAvatarById(parseInt(id));
	}

	@Get("random")
	async addUserRand(): Promise<void> {
		return await this.userService.addUser();
	}

	@Get("all")
	async getAllUsers(): Promise<UserEntity[]> {
		return await this.userService.getUsers();
	}

	@Get("delete/:id")
	async deleteUser(@Param("id") id: string): Promise<boolean> {
		return await this.userService.deleteUser(parseInt(id));
	}

	@Get("deleteAll")
	async deleteAll(): Promise<void> {
		return await this.userService.deleteAll();
	}

	@Post("add")
	insert(
		@Body("firstName") firstName: string,
		@Body("lastName") lastName: string,
		@Body("userName") userName: string,
	): Promise<number> {
		const userId = this.userService.insert(firstName, lastName, userName);
		return userId;
	}

	@Put("update/:id")
	async update(
		@Param("id") id: string,
		@Body("firstName") firstName: string,
		@Body("lastName") lastName: string,
		@Body("userName") userName: string,
		//@Body('password') password: string,
	): Promise<number> {
		return this.userService.update(parseInt(id), firstName, lastName, userName);
	}
}
