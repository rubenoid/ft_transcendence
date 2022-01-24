import {
	Controller,
	Get,
	Post,
	Put,
	Body,
	Injectable,
	Param,
	Req,
	UseInterceptors,
	UploadedFile,
	UseGuards,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { writeFile } from "fs";
import { GuardedRequest } from "src/overloaded";
import { UserEntity } from "./user.entity";
import { UserService } from "./user.service";
import { Public } from "src/auth/jwt.decorator";
import { AuthGuard } from "@nestjs/passport";
import { RegisteringGuard } from "src/auth/registering.guard";
import { MatchEntity } from "src/match/match.entity";
import { ChatEntity } from "src/chat/chat.entity";
import { ChatService } from "src/chat/chat.service";

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

	@Get("menFriendsnBlocked")
	async meAndFriends(@Req() req: GuardedRequest): Promise<UserEntity> {
		console.log("we iz here");
		return await this.userService.getUserQueryOne({
			where: { id: req.user.id },
			relations: ["friends", "blockedUsers", "blockedBy"],
		});
	}

	@Get("me/chats")
	async getMyChats(@Req() req: GuardedRequest): Promise<ChatEntity[]> {
		const data: ChatEntity[] = (
			await this.userService.getUserQueryOne({
				where: { id: req.user.id },
				relations: ["channels"],
			})
		).channels;

		for (let i = 0; i < data.length; i++) {
			const element = data[i];
			if (element.password) element["isProtected"] = true;
			delete element.password;
		}
		return data;
	}

	@Public()
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

	@Public()
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

	@Put("update")
	async update(
		@Req() req: GuardedRequest,
		@Body("firstName") firstName: string,
		@Body("lastName") lastName: string,
		@Body("userName") userName: string,
	): Promise<number> {
		return this.userService.update(req.user.id, userName, firstName, lastName);
	}

	@Post("updateForm")
	@UseInterceptors(FileInterceptor("file"))
	async updateForm(
		@Req() req: GuardedRequest,
		@UploadedFile() file: Express.Multer.File,
		@Body("user") userString: string,
	): Promise<number> {
		const user = JSON.parse(userString);
		console.log("USER FROM FORM", user);
		this.userService.update(
			req.user.id,
			user.userName,
			user.firstName,
			user.lastName,
		);
		if (file) this.userService.saveAvatar(req.user.id, file);
		return 0;
	}

	@Post("uploadAvatar")
	@UseInterceptors(FileInterceptor("file"))
	async uploadFile(
		@Req() req: GuardedRequest,
		@UploadedFile() file: Express.Multer.File,
	): Promise<void> {
		this.userService.saveAvatar(req.user.id, file);
	}

	@Public()
	@UseGuards(RegisteringGuard)
	@Get("removeTwoFA")
	async removeTwoFA(@Req() req: GuardedRequest): Promise<void> {
		console.log("removetwofa");
		const user = await this.userService.getUser(req.user.id as number);
		user.twoFactorSecret = "";
		user.twoFactorvalid = false;
		await this.userService.saveUser(user);
	}

	@Public()
	@UseGuards(RegisteringGuard)
	@Get("userStatus/:id")
	async userStatusById(@Param("id") id: string): Promise<string> {
		return await this.userService.userStatusById(parseInt(id));
	}

	@Get("getAllStatus")
	async getAllStatus(): Promise<object[]> {
		return await this.userService.getAllStatus();
	}
}
