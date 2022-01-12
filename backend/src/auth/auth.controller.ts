import {
	Controller,
	Get,
	Req,
	Res,
	UseGuards,
	Post,
	Body,
	Param,
	Redirect,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { localAuthGaurd } from "./auth.guard";
import { Response, Request, request } from "express";
import { JwtAuthGuard } from "./jwt.guard";
import { Public } from "./jwt.decorator";
import { UserService } from "src/user/user.service";
import { GuardedRequest } from "src/overloaded";
import { publicDecrypt } from "crypto";
import { UserEntity } from "src/user/user.entity";
import { get } from "http";
import { JwtService } from "@nestjs/jwt";
import { RegisteringGuard } from "./registering.guard";

@Controller("auth")
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly userService: UserService,
		private readonly jwtService: JwtService,
	) {}

	@Public()
	@UseGuards(AuthGuard("FourtyTwo"))
	@Get("login")
	async login(
		@Req() req: GuardedRequest,
		@Res({ passthrough: true }) response: Response,
	): Promise<void> {
		const user: UserEntity = await this.userService.getUserQueryOne({
			where: { id: req.user.id },
		});
		console.log("login controller user.registered", user.registered);
		console.log("user.twoFactorSecret.length", user.twoFactorSecret.length);
		console.log("user.logedin", user.logedin);
		const token: string = await this.authService.login(req.user);
		await response.cookie("AuthToken", token, { httpOnly: false });
		if (!user.registered) {
			return response.redirect("http://localhost:8080/register");
		}
		if (user.twoFactorSecret.length) {
			return response.redirect("http://localhost:8080/checkTwoFA");
		}
		user.logedin = true;
		this.userService.saveUser(user);
		return response.redirect("http://localhost:8080/profile");
	}

	@Public()
	@UseGuards(RegisteringGuard)
	@Get("getQr")
	async return2fa(@Req() req: GuardedRequest): Promise<string> {
		return await this.authService.create2fadiv(req.user.id);
	}

	@Public()
	@UseGuards(RegisteringGuard)
	@Get("twoFALogin")
	async twoFALogin(
		@Req() req: GuardedRequest,
		@Res({ passthrough: true }) response: Response,
	): Promise<void> {
		const user: UserEntity = await this.userService.getUserQueryOne({
			where: { id: req.user.id },
		});
		user.logedin = true;
		this.userService.saveUser(user);
		return response.redirect("http://localhost:8080/profile");
	}

	@Public()
	@UseGuards(RegisteringGuard)
	@Post("inputAccessCode")
	async inputAccessCode(
		@Body("usertoken") usertoken: string,
		@Req() req: GuardedRequest,
	): Promise<boolean> {
		const user: UserEntity = await this.userService.getUserQueryOne({
			where: { id: req.user.id },
		});
		const ret = await this.authService.check2faInput(
			usertoken,
			user.twoFactorSecret,
		);
		if (ret == true) {
			user.twoFactorvalid = true;
			this.userService.saveUser(user);
			console.log("user.twofactorvalid", user.twoFactorvalid);
		}
		return ret;
	}

	@Public()
	@UseGuards(RegisteringGuard)
	@Post("register")
	async insert(
		@Req() req: GuardedRequest,
		@Body("userName") userName: string,
		@Body("firstName") firstName: string,
		@Body("lastName") lastName: string,
	): Promise<void> {
		this.userService.update(req.user.id, userName, firstName, lastName);
		return;
	}

	@Public()
	@Get("protect")
	async functions(): Promise<void> {
		return await this.authService.testProtector();
	}

	@UseGuards(localAuthGaurd)
	@Get("logout")
	async logout(
		@Req() req: GuardedRequest,
		@Res({ passthrough: true }) response: Response,
	): Promise<void> {
		response.clearCookie("AuthToken");
		const user: UserEntity = await this.userService.getUserQueryOne({
			where: { id: req.user.id },
		});
		user.logedin == false;
		this.userService.saveUser(user);
		return response.redirect("http://localhost:8080/");
	}
	// @UseGuards(JwtAuthGuard)
	// @Get("guarded-jwt")
	// async hi4(@Req() req: GuardedRequest): Promise<string> {
	// 	console.log(req.user);
	// 	return "wow jwt thinks work!";
	// }
}
