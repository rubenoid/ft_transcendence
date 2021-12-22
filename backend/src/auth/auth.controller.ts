import { Controller, Get, Req, UseGuards, Post, Res} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { verifyUser } from "./auth.guard";
import { JwtService } from "@nestjs/jwt";
import { Response, Request } from "express";


@Controller('auth')
export class AuthController
{
	constructor (private readonly authService: AuthService) {}
	@Get('FourtyTwo')
	@UseGuards(AuthGuard('FourtyTwo'))
	async findUserFromFourtyTwoId(@Req() req): Promise<any> {
		// this.AuthService.findUserFromFourtyTwoId(req.user);
		// return await this.friendsService.addFriend(param.id as number, param2.id2 as number);
        // return await this.authService.findUserFromFourtyTwoId(req.user.id);
        console.log(req);
        console.log(req.user);
		return req.user;
        
	}

    @Get('always')
	async hi(@Req() req)
    {
        return "always works";
    }

    @Get('redirect')
	@UseGuards(AuthGuard('FourtyTwo'))
	async hi2(@Req() req)
    {
        console.log("req");
        // console.log(req);
        console.log("req.user");
        console.log(req.user);
        return "logged in ok";
    }

	@UseGuards(AuthGuard('FourtyTwo'))
    @Get('guarded')
	async hi3(@Req() req, @Res({passthrough: true}) response: Response)
    {
        await response.cookie('clientID', req.user, {httpOnly: true});
        return "wow thinks work!";
    }

	@UseGuards(verifyUser)
    @Get('guarded-jwt')
	async hi4(@Req() req)
    {
        return "wow jwt thinks work!";
    }
  @UseGuards(AuthGuard('FourtyTwo'))
  @Post('auth/login')
  async login(@Req() req) {
    // return this.authService.login(req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }

}
