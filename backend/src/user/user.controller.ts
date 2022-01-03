import {
	Controller,
	Get,
	Post,
	Put,
	Body,
	Injectable,
	Param,
} from "@nestjs/common";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
	constructor(private readonly userService: UserService) {}
	@Get("getAll")
	async getAll() {
		return await this.userService.getAll();
	}
	@Get("get/:id")
	async getUserById(@Param() param) {
		return await this.userService.getUser(param.id as number);
	}
	@Get("getByUserName/:username")
	async getUserByUsername(@Param() param) {
		return await this.userService.getUserByName(param.username as string);
	}

	@Get("getAvatar/:id")
	async getUserAvatarById(@Param() param) {
		return await this.userService.getUserAvatarById(param.id as number);
	}

	@Get("random")
	async addUserRand() {
		return await this.userService.addUser();
	}

	@Get("all")
	async getAllUsers() {
		return await this.userService.getUsers();
	}

	@Get("delete/:id")
	async deleteUser(@Param() param) {
		return await this.userService.deleteUser(param.id as number);
	}

	@Get("deleteAll")
	async deleteAll() {
		return await this.userService.deleteAll();
	}

	@Post("add")
	insert(
		@Body("firstName") firstName: string,
		@Body("lastName") lastName: string,
		@Body("userName") userName: string,
	) {
		const userId = this.userService.insert(firstName, lastName, userName);
		return userId;
	}

	@Put("update/:id")
	async update(
		@Param() param,
		@Body("firstName") firstName: string,
		@Body("lastName") lastName: string,
		@Body("userName") userName: string,
		//@Body('password') password: string,
	) {
		return this.userService.update(
			param.id as number,
			firstName,
			lastName,
			userName,
		);
	}
}
