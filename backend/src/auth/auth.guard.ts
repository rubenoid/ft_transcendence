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

	canActivate(context: ExecutionContext) {
		const request = <Request>context.switchToHttp().getRequest();
		//console.log("Checking user", typeof request, request);
		try {
			console.log("Cookies:", request.cookies);
			console.log(
				"request.headers[authorization]" + request.headers["authorization"],
			);
			// const jwt = request.headers["a7uthorization"];

			const jwt = request.cookies["AuthToken"];
			console.log("TOKEN:", jwt);
			// console.log(request.headers.get('authorization'));
			return this.jwtService.verify(jwt);
		} catch (e) {
			console.log("Error logging in");
			throw new UnauthorizedException("unauthorized");
		}
	}
}
