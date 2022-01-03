import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private jwtService: JwtService,
	) {}
	async findUserFromFourtyTwoId(id: number): Promise<any> {
		const user = await this.userService.getUser(id);
		if (!user) {
			throw new UnauthorizedException();
		} // not sure if need to compare with intras ID or own DB
		console.log("findUserFromFourtyTwoId METHOD:", id);
		return user;
	}

	async login(user: any) {
		const payload = { username: user.username, sub: user.userId };
		return {
			// eslint-disable-next-line camelcase
			access_token: this.jwtService.sign(payload),
		};
	}

	// async validateUser(username: string): Promise<any> {
	//     const user = await this.userService.findByUsername(username);
	//     if (user) {
	//       return user;
	//     }
	//     return null;
	//   }
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
