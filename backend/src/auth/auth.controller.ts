// import { Controller, Get, Param } from '@nestjs/common';
// import { AuthService } from './auth.service';

// @Controller('auth')
// export class AuthController {
    
// }



import {
	Controller,
	Get,
	Req,
	UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController
{
	@Get('FourtyTwo')
	@UseGuards(AuthGuard('FourtyTwo'))
	async findUserFromFourtyTwoId(@Req() req): Promise<any> {
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
        return "logged in ok";
    }
}
