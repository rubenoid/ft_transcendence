import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

@Injectable()
export class localAuthGaurd implements CanActivate {
	constructor(private jwtService: JwtService) {}

	canActivate(context: ExecutionContext): boolean {
		const request = <Request>context.switchToHttp().getRequest();
		try {
			const jwt: string =
				request.headers["authorization"] || request.cookies["AuthToken"];
			return this.jwtService.verify(jwt) != null;
		} catch (e) {
			throw new UnauthorizedException("unauthorized");
		}
	}
}
