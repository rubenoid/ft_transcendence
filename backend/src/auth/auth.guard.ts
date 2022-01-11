import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Response, Request } from "express";

@Injectable()
export class localAuthGaurd implements CanActivate {
	constructor(private jwtService: JwtService) {}

	canActivate(context: ExecutionContext): boolean {
		const request = <Request>context.switchToHttp().getRequest();
		try {
			const jwt: string =
				request.headers["authorization"] || request.cookies["AuthToken"];
			console.log("jwt", jwt);
			return this.jwtService.verify(jwt) != null;
		} catch (e) {
			
			console.log("Error logging in");
			throw new UnauthorizedException("unauthorized");
		}
	}
}
