import { Controller, Get, Param } from '@nestjs/common';
import { FriendsService } from './friends.service';


@Controller('friends')
export class FriendsController {
	constructor (private readonly friendsService: FriendsService) {}

    @Get('get/:id')
	async getFriends(@Param() param)
	{
		console.log("in b4");
		return await this.friendsService.getFriends(param.id as number);
	}

	@Get('add/:id/:id2')
	async addFriend(@Param() param, @Param() param2)
	{
		console.log("in b4");
		return await this.friendsService.addFriend(param.id as number, param2.id2 as number);
	}

	@Get('remove/:id/:id2')
	async remove(@Param() param, @Param() param2)
	{
		return await this.friendsService.remove(param.id as number, param2.id2 as number);
	}
}
