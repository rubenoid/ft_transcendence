import { Controller, Get, Req, UseGuards, Post, Body} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from 'src/user/user.entity';
import { AuthService } from './auth.service';
import { RegistrationStatus } from './registration.status.interface';
import { LoginStatus } from './login.status.interface';

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
    @Get('guarded-jwt')
	@UseGuards(AuthGuard('jwt'))
	async hi4(@Req() req)
    {
        return "wow thinks work jwt!";
    }
    @Post('register')  
    public async register(@Body() createUserDto: UserEntity,  ): Promise<RegistrationStatus> {    
    const result: 
    RegistrationStatus = await this.authService.register(createUserDto,);
    if (!result.success) {
        throw 'new HttpException(result.message, HttpStatus.BAD_REQUEST)';    
    }
    return result;  
    }
    @Post('login')  
    public async login(@Body() loginUserDto: UserEntity): Promise<LoginStatus> {
        return await this.authService.login(loginUserDto);  
    }
}
