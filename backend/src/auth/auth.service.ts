import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { JwtService } from "@nestjs/jwt";
import { UserEntity } from "src/user/user.entity";
import * as twofa from "../2fa/2fa";

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
	async create2fadiv(id: number) {
		const user: UserEntity = await this.userService.getUser(id);

		const codedata = twofa.getTwoFactorAuthenticationCode();
		user.twoFactorSecret = codedata.base32;
		const qrcode = await twofa.createQrCodeAsURL(codedata.otpauthUrl);
		console.log("twoFactorSecret=", user.twoFactorSecret);
		await this.userService.saveUser(user);
		return `
				<img src="${qrcode}">
				<p>We will only show this once! so be sure to save it or you're fucked</p>
		`;
	}

	async give2fa(id: number) {
		return await twofa.runexample();
	}
}
