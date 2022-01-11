import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import { UserService } from "src/user/user.service";
import { UserEntity } from "src/user/user.entity";

@Injectable()
export class RegisteringStrategy extends PassportStrategy(Strategy, "registering") {
	constructor(
		private readonly userService: UserService,
	) {
		super({
			ignoreExpiration: false,
			secretOrKey: "secretKey",
			jwtFromRequest: ExtractJwt.fromExtractors([
				/* eslint-disable */
				(request: Request | any): null | string => {
					let data = "";
					try {
						data =
							request.headers["authorization"] || request?.cookies["AuthToken"];
					} catch (er) {
						data = request.handshake.headers.authorization;
					}
					if (data == "") {
						return null;
					}
					console.log("jwt data:", data);
					return data;
				},
			]),
		});
	}

	async validate(payload: object): Promise<object> {
		console.log("Registering Payload validate jwt", payload);
		const user: UserEntity = await this.userService.getUserQueryOne({
			where: { id: payload["id"] },
		});
		console.log("user.registered", user.registered);
		console.log("user.twoFactorSecret.length", user.twoFactorSecret.length);
		console.log("user.twoFactorvalid", user.twoFactorvalid);
		if (payload === null)// || user.registered == false || (user.twoFactorSecret.length && user.twoFactorvalid == false)) {
			throw new UnauthorizedException();
		// }
		console.log("IN REGISERTING STRAGTEY:", payload);
		return payload;
	}
}
