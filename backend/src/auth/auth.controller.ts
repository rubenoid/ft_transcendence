import { Controller, Get, Req, Res, UseGuards, Post } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { localAuthGaurd } from "./auth.guard";
import { Response, Request, request } from "express";
import { JwtAuthGuard } from "./jwt.guard";
import { Public } from "./jwt.decorator";

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Public()
	@UseGuards(AuthGuard("FourtyTwo"))
	@Get("login")
	async login(@Req() req, @Res({ passthrough: true }) response: Response) {
		console.log("Login user", req.user);
		const token: string = await this.authService.login(req.user);
		await response.cookie("AuthToken", token, { httpOnly: false });
		// if (!user)
		// 	return response.redirect("http://localhost:8080/register");
		return response.redirect("http://localhost:8080/");
	}

	@UseGuards(localAuthGaurd)
	@Post("register")
	async register(@Req() req) {
		console.log(req.user);
		// await this.UserService.addwithDetails(
		// 	client["id"],
		// 	"login",
		// 	"first_name",
		// 	"last_name",
		// 	// replaced by registration form
		// 		);
	}

	@UseGuards(JwtAuthGuard)
	@Get("guarded-jwt")
	async hi4(@Req() req) {
		console.log(req.user);
		return "wow jwt thinks work!";
	}
	@UseGuards(localAuthGaurd)
	@Get("logout")
	async logout(
		// @Req() request: Request,
		@Res({ passthrough: true }) response: Response,
	) {
		response.clearCookie("AuthToken");
		return { message: "logged out" };
	}
}
