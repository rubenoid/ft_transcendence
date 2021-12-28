import { PassportStrategy } from '@nestjs/passport';
import { Injectable, HttpService } from '@nestjs/common';
import { Strategy } from 'passport-oauth2';
import axios from 'axios';
import { JwtService } from "@nestjs/jwt";
import { AuthService } from './auth.service';

@Injectable()
export class FourtyTwoStrategy extends PassportStrategy(Strategy, 'FourtyTwo')
{
	constructor( private jwtService: JwtService) {
		super({
			authorizationURL: "https://api.intra.42.fr/oauth/authorize?client_id=c56a44ddcaa1b408426867f5d1c7ff2a9fb4d983f2aae92f361bf53d8b83f4fd&redirect_uri=http%3A%2F%2Flocalhost%3A5000%2Fauth%2Fredirect&response_type=code",
			tokenURL        : "https://api.intra.42.fr/oauth/token",
			clientID        : "c56a44ddcaa1b408426867f5d1c7ff2a9fb4d983f2aae92f361bf53d8b83f4fd",
			clientSecret    : "616696fabcc2c8b87bf5cf43d733163b11a14b74d6c4551974347cdcd9922c06",
			callbackURL     : "http://localhost:5000/auth/redirect",
			// scope           : null,
		});
	}

    async validate(accessToken: string): Promise<any> {
        const result = await axios.get('https://api.intra.42.fr/v2/me', {
          headers: { Authorization: `Bearer ${ accessToken }` },
        })
		// .toPromise();
        console.log("VALIDATE METHOD:")
		// console.log(result);
		console.log("result.data.login" + result.data.login);
		console.log(result.data.first_name);
		console.log(result.data.last_name);
        console.log("VALIDATE METHOD KLAAR:")

      const jwt = await this.jwtService.signAsync({id: result.data.id});

      console.log("JWT", jwt);
      return jwt;

    }
    // async validate(accessToken: string): Promise<any> {
    //     const data = await this.http.get('https://api.intra.42.fr/v2/me', {
    //         headers: { Authorization: `Bearer ${ accessToken }` },
    //     }).toPromise();
    //     const jwt = await this.jwtService.signAsync({id: data.data.id});

    //     return jwt;
    // }
      
}
