import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Strategy } from "passport-oauth2";
import axios from "axios";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { UserService } from "src/user/user.service";

@Injectable()
export class FourtyTwoStrategy extends PassportStrategy(Strategy, "FourtyTwo") {
	constructor(private jwtService: JwtService, private authService: AuthService,
		private userService: UserService) {
		super({
			authorizationURL:
				"https://api.intra.42.fr/oauth/authorize?client_id=4812972391c0c40e90979ab5764cde5b45fdd3354983c113b1c39adf1b00676a&redirect_uri=http%3A%2F%2Flocalhost%3A5000%2Fauth%2Flogin&response_type=code",
			tokenURL: "https://api.intra.42.fr/oauth/token",
			clientID:
				"4812972391c0c40e90979ab5764cde5b45fdd3354983c113b1c39adf1b00676a",
			clientSecret:
				"948727952c9bf9e9e0b52f3cfd4a26f80606dc58ef1189b1bd4efdd48a96bb1b",
			callbackURL: "http://localhost:5000/auth/login",
			// scope           : null,
		});
	}

	async validate(accessToken: string): Promise<any> {
		const result = await axios.get("https://api.intra.42.fr/v2/me", {
			headers: { Authorization: `Bearer ${accessToken}` },
		});

		let user = await this.authService.validateUser(result.data.id);
		if (!user) {
		await this.userService.addwithDetails(
			result.data.id,
			result.data.login,
			result.data.first_name,
			result.data.last_name,
				);
			user = await this.authService.validateUser(result.data.login);
			if (!user)
			{
				throw new UnauthorizedException();
			}
		}
		return user;
	}
}
