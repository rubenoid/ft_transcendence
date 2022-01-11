import {
	Controller,
	Get,
	Post,
	Put,
	Body,
	Injectable,
	Param,
	Req,
	UseGuards,
} from "@nestjs/common";
import { GuardedRequest } from "src/overloaded";
import { UserEntity } from "./user.entity";
import { UserService } from "./user.service";
import { Public } from "src/auth/jwt.decorator";
import { AuthGuard } from "@nestjs/passport";
import { RegisteringGuard } from "src/auth/registering.guard";

@Controller("user")
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Public()
	@UseGuards(RegisteringGuard)
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

	@Public()
	@UseGuards(RegisteringGuard) // so it can be used in the register part of form
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

	@Public()
	@UseGuards(RegisteringGuard) // take this out for testing
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
