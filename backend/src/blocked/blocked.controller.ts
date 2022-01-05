import { Controller, Get, Param, Req } from "@nestjs/common";
import { GuardedRequest } from "src/overloaded";
// import { FriendsService } from 'src/friends/friends.service';
import { BlockedService } from "./blocked.service";

@Controller("blocked")
export class BlockedController {
	constructor(private readonly blockedService: BlockedService) {}

	@Get("add/:id")
	async blockUser(
		@Req() req: GuardedRequest,
		@Param("id") id: string,
	): Promise<void> {
		return await this.blockedService.blockUser(
			req.user.id as number,
			parseInt(id),
		);
	}

	@Get("getall/:id")
	async getAll(@Param("id") id: string): Promise<number[]> {
		console.log("getall controller");

		return await this.blockedService.getAll(parseInt(id));
	}

	@Get("remove/:id")
	async remove(
		@Req() req: GuardedRequest,
		@Param("id") id: string,
	): Promise<boolean> {
		console.log("unblock controller");

		return await this.blockedService.remove(
			req.user.id as number,
			parseInt(id),
		);
	}

	// @Get('add/:idMe/:id2block')
	// async blockUser(@Param() param: object, @Param() param: object2)
	// {
	// 	return await this.blockedService.blockUser(param.idMe as number, param2.idToBlock as number);
	// }

	// @Get('get/:id')
	// async getFriends(@Param() param: object)
	// {
	// 	return await this.blockedService.getFriends(param.id as number);
	// }

	// @Get('remove/:id/:id2')
	// async remove(@Param() param: object, @Param() param: object2)
	// {
	// 	return await this.blockedService.remove(param.id as number, param2.id2 as number);
	// }
}
