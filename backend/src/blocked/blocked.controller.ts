import { Controller, Get, Param } from '@nestjs/common';
// import { FriendsService } from 'src/friends/friends.service';
import { BlockedService } from './blocked.service';

@Controller('blocked')
export class BlockedController {
    constructor (private readonly blockedService: BlockedService) {}


    @Get('add/:idMe/:idToBlock')
    async blockUser(@Param() param, @Param() param2)
    {
        return await this.blockedService.blockUser(param.idMe as number, param2.idToBlock as number);
    }

    @Get('getall/:id')
    async getAll(@Param() param)
    {
        return await this.blockedService.getAll(param.id as number);
    }

	@Get('remove/:id')
    async remove(@Param() param)
    {
        return await this.blockedService.remove(param.id as number);
    }

	// @Get('add/:idMe/:id2block')
	// async blockUser(@Param() param, @Param() param2)
	// {
	// 	return await this.blockedService.blockUser(param.idMe as number, param2.idToBlock as number);
	// }

    // @Get('get/:id')
	// async getFriends(@Param() param)
	// {
	// 	return await this.blockedService.getFriends(param.id as number);
	// }

	// @Get('remove/:id/:id2')
	// async remove(@Param() param, @Param() param2)
	// {
	// 	return await this.blockedService.remove(param.id as number, param2.id2 as number);
	// }
}
