import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
	constructor( private readonly userService: UserService,) {}
    async findUserFromFourtyTwoId(id: number): Promise<any> {
    const user = await this.userService.getUser(id);
    if ( !user ) {
        throw new UnauthorizedException();
    }   // not sure if need to compare with intras ID or own DB
    console.log("findUserFromFourtyTwoId METHOD:")
    console.log(id);
    return user;
      } 
}



// import {
// 	Injectable,
// 	UnauthorizedException,
// } from '@nestjs/common';
// import { UsersService } from '../users/users.service';

// @Injectable()
// export class AuthService
// {
// 	constructor(
// 		private readonly usersService: UsersService,
// 	) {
// 	}

// 	async findUserFromDiscordId(discordId: string): Promise<any> {
// 		const user = await this.usersService.findOne('discord_id', discordId);

// 		if ( !user ) {
// 			throw new UnauthorizedException();
// 		}

// 		return user;
// 	}
// }
