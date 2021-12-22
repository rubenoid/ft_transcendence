import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import { Response, Request } from "express";

@Injectable()
export class verifyUser implements CanActivate {
    constructor(private jwtService: JwtService) {}

    canActivate(context: ExecutionContext) {
		const request = <Request>context.switchToHttp().getRequest();
		//console.log("Checking user", typeof request, request);
        try {
            console.log('>>>');
            
			// console.log(request);
            
            console.log('<<<');
            
			console.log(request.cookies, request.signedCookies);
            //console.log("request.headers[authorization]" + request.headers["authorization"]);
            const jwt = request.headers["authorization"];
			// const jwt = request.headerField;
			console.log("TOKEN:", jwt);
            // console.log(request.headers.get('authorization'));
            return this.jwtService.verify(jwt.split(' ')[1]);
            // return this.jwtService.verify("..y8Lrw_joy4bWbQ1Bvw-vVAOAWk0Yy6zRi38uQXCokns");
        } catch (e) {
			console.log("Error logging in")
            throw new UnauthorizedException('unauthorized');
        }
    }
}
 