import { Injectable, UnauthorizedException } from "@nestjs/common";
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
		await this.userService.saveUser(user);
		return qrcode;
	}

	async getQrRetSecret(id: number): Promise<object> {
		const codedata = twofa.getTwoFactorAuthenticationCode();
		const qrcode = await twofa.createQrCodeAsURL(codedata.otpauthUrl);
		return { qrcode: qrcode, secret: codedata.base32 };
	}

	async saveNewQr(id: number, secret: string): Promise<void> {
		console.log("save secret");
		const user: UserEntity = await this.userService.getUser(id);
		user.twoFactorSecret = secret;
		user.twoFactorvalid = true;
		await this.userService.saveUser(user);
	}

	async check2faInput(input: string, secret: string): Promise<boolean> {
		return await twofa.check2faInput(input, secret);
	}

	// async testProtector(): Promise<void> {
	// 	const h = await this.protectorService.hash("i like react kidding");
	// 	this.protectorService
	// 		.compare("i love angular", h)
	// 		.then((res) => console.log(res));
	// 	this.protectorService
	// 		.compare("i like react kidding", h)
	// 		.then((res) => console.log(res));
	// }
}
