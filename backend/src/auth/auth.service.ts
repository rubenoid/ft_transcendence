import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { JwtService } from "@nestjs/jwt";
import { UserEntity } from "src/user/user.entity";
import * as twofa from "../2fa/2fa";
import { identity } from "rxjs";

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private jwtService: JwtService,
	) {}

	async login(user: UserEntity): Promise<string> {
		const payload = { ...user };
		// console.log("payload", payload);
		return this.jwtService.sign(payload);
	}

	async validateUser(id: number): Promise<UserEntity | null> {
		const user = await this.userService.getUser(id);
		if (user) {
			return user;
		}
		return null;
	}
	async create2fadiv(id: number): Promise<string> {
		const user: UserEntity = await this.userService.getUser(id);
		const codedata = twofa.getTwoFactorAuthenticationCode();
		user.twoFactorSecret = codedata.base32;
		const qrcode = await twofa.createQrCodeAsURL(codedata.otpauthUrl);
		console.log("twoFactorSecret=", user.twoFactorSecret);
		await this.userService.saveUser(user);
		return `
		${qrcode}
			`;
		// <image src="${qrcode}">
		// <p>We will only show this once! so be sure to save it or you're fucked</p>
	}

	async check2faInput(input: string, secret: string): Promise<boolean> {
		return await twofa.check2faInput(input, secret);
	}
}
