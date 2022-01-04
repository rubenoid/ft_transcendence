import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({
			ignoreExpiration: false,
			secretOrKey: "secretKey",
			jwtFromRequest: ExtractJwt.fromExtractors([
				(request: Request) => {
					const data = request.headers["authorization"] || request?.cookies["AuthToken"];
					if (!data) {
						return null;
					}
					return data;
				},
			]),
		});
	}

	async validate(payload: any) {
		console.log("Payload", payload);
		if (payload === null) {
			throw new UnauthorizedException();
		}
		return payload;
	}
}
