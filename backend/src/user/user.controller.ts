import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Req,
	UseInterceptors,
	UploadedFile,
	UseGuards,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { GuardedRequest } from "src/overloaded";
import { UserEntity } from "./user.entity";
import { UserService } from "./user.service";
import { Public } from "src/auth/jwt.decorator";
import { RegisteringGuard } from "src/auth/registering.guard";
import { ChatEntity } from "src/chat/chat.entity";

@Controller("user")
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get("all")
	async getAllUsers(): Promise<UserEntity[]> {
		return await this.userService.getUsers();
	}

	@Get("getAllUsersNRelations")
	async getAllUsersNRelations(): Promise<UserEntity[]> {
		return await this.userService.getAllUsersNRelations();
	}
	@Get("get/:id")
	async getUserById(
		@Req() req: GuardedRequest,
		@Param("id") id: string,
	): Promise<UserEntity | string> {
		return await this.userService.getUser(req.user.id, parseInt(id));
	}
	@Get("me")
	async getme(@Req() req: GuardedRequest): Promise<UserEntity | string> {
		return await this.userService.getUser(-1, req.user.id as number);
	}

	@Get("menFriendsnBlocked")
	async meAndFriends(@Req() req: GuardedRequest): Promise<UserEntity> {
		return await this.userService.getUserQueryOne({
			where: { id: req.user.id },
			relations: ["friends", "blockedUsers", "blockedBy"],
		});
	}

	@Get("me/chats")
	async getMyChats(@Req() req: GuardedRequest): Promise<ChatEntity[]> {
		return await this.userService.getMyChats(req.user.id);
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

	@Get("delete/:id")
	async deleteUser(@Param("id") id: string): Promise<boolean> {
		return await this.userService.deleteUser(parseInt(id));
	}

	@Post("updateForm")
	@UseInterceptors(FileInterceptor("file"))
	async updateForm(
		@Req() req: GuardedRequest,
		@UploadedFile() file: Express.Multer.File,
		@Body("user") userString: string,
	): Promise<number> {
		const user = JSON.parse(userString);
		this.userService.update(
			req.user.id,
			user.userName,
			user.firstName,
			user.lastName,
		);
		if (file) await this.userService.saveAvatar(req.user.id, file);
		return 0;
	}

	@Public()
	@UseGuards(RegisteringGuard)
	@Get("removeTwoFA")
	async removeTwoFA(@Req() req: GuardedRequest): Promise<void> {
		const user = await this.userService.getUser(-1, req.user.id as number);
		if (typeof user != "object") return;
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

	@Get("find/:id")
	async find(@Param("id") name: string): Promise<UserEntity[]> {
		return await this.userService.findUser(name);
	}

	@Public()
	// @UseGuards(RegisteringGuard) // take this out for testing
	@Get("deleteAll")
	async deleteAll(): Promise<void> {
		return await this.userService.deleteAll();
	}

	// @Public()
	// @UseGuards(RegisteringGuard)
	// @Get("getAll")
	// async getAll(): Promise<UserEntity[]> {
	// 	return await this.userService.getAll();
	// }

	// @Post("add")
	// insert(
	// 	@Body("firstName") firstName: string,
	// 	@Body("lastName") lastName: string,
	// 	@Body("userName") userName: string,
	// ): Promise<number> {
	// 	const userId = this.userService.insert(firstName, lastName, userName);
	// 	return userId;
	// }

	// @Put("update")
	// async update(
	// 	@Req() req: GuardedRequest,
	// 	@Body("firstName") firstName: string,
	// 	@Body("lastName") lastName: string,
	// 	@Body("userName") userName: string,
	// ): Promise<number> {
	// 	return this.userService.update(req.user.id, userName, firstName, lastName);
	// }

	// @Post("uploadAvatar")
	// @UseInterceptors(FileInterceptor("file"))
	// async uploadFile(
	// 	@Req() req: GuardedRequest,
	// 	@UploadedFile() file: Express.Multer.File,
	// ): Promise<void> {
	// 	this.userService.saveAvatar(req.user.id, file);
	// }
}
