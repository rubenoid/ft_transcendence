import { Controller, Get, Req, Res, UseGuards, Post, Body } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { localAuthGaurd } from "./auth.guard";
import { Response, Request, request } from "express";
import { JwtAuthGuard } from "./jwt.guard";
import { Public } from "./jwt.decorator";
import { UserService } from "src/user/user.service";
import { get } from "http";

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService,
			private readonly userService: UserService
		) {}

	@Public()
	@UseGuards(AuthGuard("FourtyTwo"))
	@Get("login")
	async login(@Req() req, @Res({ passthrough: true }) response: Response) {
		const token: string = await this.authService.login(req.user);
		await response.cookie("AuthToken", token, { httpOnly: false });
		if(!req.user.registered) {
				return response.redirect("http://localhost:8080/register");
		}
		return response.redirect("http://localhost:8080/profile");
	}

	@UseGuards(JwtAuthGuard)
	@Post("register") 
	insert(
		@Body("firstName") firstName: string,
		@Body("lastName") lastName: string,
		@Body("userName") userName: string,
		@Req() req,
		@Res() response,
	)
	{
		this.userService.update(
			req.user.id,
			userName,
			firstName,
			lastName,
		);
		return;
	}


	@UseGuards(JwtAuthGuard)
	@Get("guarded-jwt")
	async hi4(@Req() req) {
		return "wow jwt thinks work!";
	}
	@UseGuards(localAuthGaurd)
	@Get("logout")
	async logout(
		@Res({ passthrough: true }) response: Response,
	) {
		response.clearCookie("AuthToken");
		return { message: "logged out" };
	}
}
