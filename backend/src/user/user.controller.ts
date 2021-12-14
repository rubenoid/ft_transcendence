import { Controller, Get, Post, Put, Body, Injectable, Param } from '@nestjs/common';
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

	@Post()
	insertUser(
		@Body('firstName') firstName: string,
		@Body('lastName') lastName: string,
		@Body('userName') userName: string,
	) {
		const userId = this.userService.insertUser(firstName, lastName, userName);
		return userId;
		// return {
		// 	id: userId,
		// }
	}

	// @Put(':id')
	// update()
}
