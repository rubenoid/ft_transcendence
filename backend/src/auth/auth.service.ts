import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private jwtService: JwtService,
	) {}

	async login(user: any) {
		const payload = { userName: user.userName, id: user.id };
		console.log("payload", payload);
		return this.jwtService.sign(payload);
	}

	async validateUser(id: number): Promise<any> {
		const user = await this.userService.getUser(id);
		if (user) {
			return user;
		}
		return null;
	}
}
