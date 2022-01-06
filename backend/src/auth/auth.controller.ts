import {
	Controller,
	Get,
	Req,
	Res,
	UseGuards,
	Post,
	Body,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { localAuthGaurd } from "./auth.guard";
import { Response, Request, request } from "express";
import { JwtAuthGuard } from "./jwt.guard";
import { Public } from "./jwt.decorator";
import { UserService } from "src/user/user.service";
import { GuardedRequest } from "src/overloaded";

@Controller("auth")
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly userService: UserService,
	) {}

	@Public()
	@UseGuards(AuthGuard("FourtyTwo"))
	@Get("login")
	async login(
		@Req() req: GuardedRequest,
		@Res({ passthrough: true }) response: Response,
	): Promise<void> {
		console.log("Login user", req.user);
		const token: string = await this.authService.login(req.user);
		await response.cookie("AuthToken", token, { httpOnly: false });
		if (!req.user.registered) {
			return response.redirect("http://localhost:8080/register");
		}
		console.log("2FA not enabled so go straight to profile");
		if (!req.user.twoFAenabled) {
			console.log("2FA not enabled so go straight to profile");
			return response.redirect("http://localhost:8080/profile");
		} else {
			return response.redirect("http://localhost:5000/auth/getQr");
		}
		console.log("2FA enabled SO GO THROUGH THIS FLOW FIRST");
		// this.authService.create2fadiv(req.user.id);
		return response.redirect("http://localhost:8080/profile");
	}

	@Get("getQr")
	async return2fa(@Req() req: GuardedRequest): Promise<string> {
		return await this.authService.create2fadiv(req.user.id);
	}

	// @Get("sendQr")
	// async get2fa(@Req() req) {
	// 	return await this.authService.give2fa(req.user.id);
	// }

	// @Post("sendQr")
	// async get2fa(@Req() req) {
	// 	check2faInput(poststuff, user.twoFactorSecret);
	//if true
	// 	return await this.authService.give2fa(req.user.id);
	// }
	// in strategy if authenticated

	@UseGuards(JwtAuthGuard)
	@Post("register")
	insert(
		@Body("firstName") firstName: string,
		@Body("lastName") lastName: string,
		@Body("userName") userName: string,
		@Body("twoFAenabled") twoFAenabled: boolean,
		@Req() req: GuardedRequest,
	): Promise<void> {
		this.userService.update(
			req.user.id,
			userName,
			firstName,
			lastName,
			twoFAenabled,
		);
		return;
	}

	@UseGuards(JwtAuthGuard)
	@Get("guarded-jwt")
	async hi4(@Req() req: GuardedRequest): Promise<string> {
		console.log(req.user);
		return "wow jwt thinks work!";
	}
	@UseGuards(localAuthGaurd)
	@Get("logout")
	async logout(
		// @Req() req: GuardedRequestuest: Request,
		@Res({ passthrough: true }) response: Response,
	): Promise<object> {
		response.clearCookie("AuthToken");
		return { message: "logged out" };
	}
}
