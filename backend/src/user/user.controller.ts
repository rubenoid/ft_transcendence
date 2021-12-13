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
	@Get('changeFirstName/:id') // @post
	async changeFirstName(@Param() param)
	{
		console.log("before change");
		return await this.userService.changeFirstName(param.id as number);
	}

	@Get('getAllUsers')
	async getAllUsers()
	{
		return await this.userService.getAllUsers();
	}

	@Get('addFriend/:id/:id2')
	async addFriend(@Param() param, @Param() param2)
	{
		console.log("in b4");
		return await this.userService.addFriend(param.id as number, param2.id2 as number);
	}

	@Get('getFriends/:id')
	async getFriends(@Param() param)
	{
		console.log("in b4");
		return await this.userService.getFriends(param.id as number);
	}
	@Get('deleteAllUsers')
	async deleteAllUsers()
	{
		return await this.userService.deleteAllUsers();
	}

	@Get(':id')
	async getUserById(@Param() param)
	{
		return await this.userService.getUser(param.id as number);
	}

}
