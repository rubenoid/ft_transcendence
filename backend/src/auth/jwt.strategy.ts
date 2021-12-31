import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({
			ignoreExpiration: false,
			secretOrKey: "My random secret key never let others",
			jwtFromRequest: ExtractJwt.fromExtractors([
				(request: Request) => {
					const data = request?.cookies["AuthToken"];
					if (!data) {
						return null;
					}
					return data.token;
				},
			]),
		});
	}

	async validate(payload: any) {
		if (payload === null) {
			throw new UnauthorizedException();
		}
		return payload;
	}
}
