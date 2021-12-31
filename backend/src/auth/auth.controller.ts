import {Body, Controller, Get, Post, Put, Req, Res, UnauthorizedException, UseGuards} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { localAuthGaurd } from "./auth.guard";
import { JwtService } from "@nestjs/jwt";
import { Response, Request } from "express";
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController
{
	constructor (private readonly authService: AuthService,
        private readonly UserService: UserService,
        private readonly jwtService: JwtService) {}
    
	@UseGuards(AuthGuard('FourtyTwo'))
    @Get('login')
    async login(@Req() req, @Res({passthrough: true}) response: Response) {
        await response.cookie('AuthToken', req.user, {httpOnly: true});
        const client = await this.jwtService.verifyAsync(req.user);
        const user = await this.UserService.getUser(client['id']);
        if (!user)
            return await this.UserService.addwithDetails(client['id'], "login", "first_name", "last_name");
        return "logged in ok";
    }

	@UseGuards(localAuthGaurd)
    @Get('guarded-jwt')
	async hi4(@Req() req)
    {
        return "wow jwt thinks work!";
    }
    @UseGuards(localAuthGaurd)
    @Get('logout')
    async logout(@Req() request: Request, @Res({passthrough: true}) response: Response) {
        response.clearCookie('AuthToken');
        return {message: 'logged out'}
    }
//   @UseGuards(AuthGuard('FourtyTwo'))
//   @Post('auth/login')
//   async login(@Req() req) {
//     // return this.authService.login(req.user);
//   }

//   @UseGuards(AuthGuard('jwt'))
//   @Get('profile')
//   getProfile(@Req() req) {
//     return req.user;
//   }

  	// @Get('FourtyTwo')
	// @UseGuards(AuthGuard('FourtyTwo'))
	// async findUserFromFourtyTwoId(@Req() req): Promise<any> {
	// 	// this.AuthService.findUserFromFourtyTwoId(req.user);
	// 	// return await this.friendsService.addFriend(param.id as number, param2.id2 as number);
    //     // return await this.authService.findUserFromFourtyTwoId(req.user.id);
    //     console.log(req);
    //     console.log(req.user);
	// 	return req.user;
	// }
    // @Get('always')
	// async hi(@Req() req)
    // {
    //     return "always works";
    // }

}
