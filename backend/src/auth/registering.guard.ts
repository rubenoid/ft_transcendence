import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";
import { RegisteringStrategy } from "./registering.stragey";

@Injectable()
export class RegisteringGuard extends AuthGuard("registering") {
	constructor(private reflector: Reflector) {
		super();
	}

	canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		console.log("IN REGISTERING GUARD");
		return super.canActivate(context);
	}
}
