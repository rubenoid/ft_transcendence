import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import { UserService } from "src/user/user.service";
import { UserEntity } from "src/user/user.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly userService: UserService) {
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
		const user: UserEntity = await this.userService.getUserQueryOne({
			where: { id: payload["id"] },
		});
		console.log("in jwt validate user.logedin", user.logedin);
		console.log("user.twoFactorvalid", user.twoFactorvalid);
		console.log("user.twoFactorSecret", user.twoFactorSecret);
		if (payload === null || user.logedin == false || (user.twoFactorSecret.length && user.twoFactorvalid == false)) {
			throw new UnauthorizedException();
		}
		console.log("in jwt user is", user);
		return payload;
	}
}
