import { Controller, Get, Param, Req } from "@nestjs/common";
import { GuardedRequest } from "src/overloaded";
import { UserEntity } from "src/user/user.entity";
// import {  } from 'src/friends/friends.service';
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
	async getAll(@Param("id") id: string): Promise<UserEntity[]> {
		console.log("getall controller");
		return await this.blockedService.getAll(parseInt(id));
	}

	@Get("remove/:id")
	async remove(
		@Req() req: GuardedRequest,
		@Param("id") id: string,
	): Promise<boolean> {
		return await this.blockedService.remove(
			req.user.id as number,
			parseInt(id),
		);
	}
}
