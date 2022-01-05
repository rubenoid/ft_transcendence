import { Controller, Get, Param, Req } from "@nestjs/common";
import { GuardedRequest } from "src/overloaded";
import { UserEntity } from "src/user/user.entity";
import { FriendsService } from "./friends.service";

@Controller("friends")
export class FriendsController {
	constructor(private readonly friendsService: FriendsService) {}

	@Get("get/:id")
	async getFriends(@Param("id") id: string): Promise<UserEntity[]> {
		return await this.friendsService.getFriends(parseInt(id));
	}

	@Get("me")
	async myFriends(@Req() req: GuardedRequest): Promise<UserEntity[]> {
		return await this.friendsService.getFriends(req.user.id as number);
	}

	@Get("add/:id")
	async addFriend(
		@Req() req: GuardedRequest,
		@Param("id") id: string,
	): Promise<void> {
		return await this.friendsService.addFriend(
			req.user.id as number,
			parseInt(id),
		);
	}

	@Get("remove/:id")
	async remove(
		@Req() req: GuardedRequest,
		@Param("id") id: string,
	): Promise<void> {
		return await this.friendsService.remove(
			req.user.id as number,
			parseInt(id),
		);
	}
}
