import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UserEntity } from 'src/user/user.entity';
import { JwtPayload } from './payload.interface';
import { FourtyTwoStrategy } from './auth.strategy';

@Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) { 
    export class JwtStrategy extends PassportStrategy(Strategy) { 
        constructor(private readonly authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'secretkey',
        });  
    }
    
    async validate(payload: JwtPayload): Promise<UserEntity> {
        const user = await this.authService.validateUser(payload);
        if (!user) {
            throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);    
        }    
        return user;  
    }
}