import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { JwtService } from "@nestjs/jwt";
import { UserEntity } from "src/user/user.entity";

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private jwtService: JwtService,
	) {}

	async login(user: UserEntity): Promise<string> {
		const payload = { userName: user.userName, id: user.id };
		console.log("payload", payload);
		return this.jwtService.sign(payload);
	}

	async validateUser(username: string): Promise<UserEntity | null> {
		const user = await this.userService.getUserByName(username);
		if (user) {
			return user;
		}
		return null;
	}
}
