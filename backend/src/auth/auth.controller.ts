import { Controller, Get, Req, UseGuards,} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

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
        console.log(req);
        console.log("req.user");
        console.log(req.user);
        return "logged in ok";
    }

    @Get('guarded')
	@UseGuards(AuthGuard('FourtyTwo'))
	async hi3(@Req() req)
    {
        return "wow thinks work!";
    }

}
