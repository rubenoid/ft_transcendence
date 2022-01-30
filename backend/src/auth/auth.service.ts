import { Injectable } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { JwtService } from "@nestjs/jwt";
import { UserEntity } from "src/user/user.entity";
import * as twofa from "../2fa/2fa";
import { ProtectorService } from "src/protector/protector";

@Injectable()
export class AuthService {
	constructor(
		private readonly protectorService: ProtectorService,
		private readonly userService: UserService,
		private jwtService: JwtService,
	) {}

	async login(user: { id: number }): Promise<string> {
		const payload = { id: user.id };
		return this.jwtService.sign(payload);
	}

	async validateUser(id: number): Promise<UserEntity | null> {
		const user = await this.userService.getUser(-1, id);
		if (typeof user == "object") {
			return user;
		}
		return null;
	}

	async getQrRetSecret(): Promise<object> {
		const codedata = twofa.getTwoFactorAuthenticationCode();
		const qrcode = await twofa.createQrCodeAsURL(codedata.otpauthUrl);
		return { qrcode: qrcode, secret: codedata.base32 };
	}

	async saveNewQr(id: number, secret: string): Promise<void> {
		const user: UserEntity | string = await this.userService.getUser(-1, id);
		if (typeof user != "object") return;
		user.twoFactorSecret = secret;
		user.twoFactorvalid = true;
		await this.userService.saveUser(user);
	}

	async check2faInput(input: string, secret: string): Promise<boolean> {
		return await twofa.check2faInput(input, secret);
	}
}
