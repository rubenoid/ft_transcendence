import { Controller, Get, Injectable, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
	constructor (private readonly userService: UserService) {}
	
	@Get('random')
	async addUserRand()
	{
		return await this.userService.addUser();
	}

	@Get('delete/:id')
	async deleteUser(@Param() param)
	{
		return await this.userService.deleteUser(param.id as number);
	}

	@Get(':id')
	async getUserById(@Param() param)
	{
		return await this.userService.getUser(param.id as number);
	}

}
