import { Controller, Get, Param, Req } from "@nestjs/common";
import { FriendsService } from "./friends.service";

@Controller("friends")
export class FriendsController {
	constructor(private readonly friendsService: FriendsService) {}

	@Get("get/:id")
	async getFriends(@Param() param) {
		return await this.friendsService.getFriends(param.id as number);
	}

	@Get("me")
	async myFriends(@Req() req, @Param() param) {
		return await this.friendsService.getFriends(req.user.id as number);
	}

	@Get("add/:id")
	async addFriend(@Req() req, @Param() param) {
		return await this.friendsService.addFriend(
			req.user.id as number,
			param.id as number,
		);
	}

	@Get("remove/:id")
	async remove(@Req() req, @Param() param) {
		return await this.friendsService.remove(
			req.user.id as number,
			param.id as number,
		);
	}
}
