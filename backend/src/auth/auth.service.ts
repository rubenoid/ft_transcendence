import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { RegistrationStatus } from './registration.status.interface';
import { LoginStatus } from './login.status.interface';
import { UserEntity } from 'src/user/user.entity';
import { JwtPayload } from './payload.interface';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService, private readonly jwtService: JwtService,  ) {}
    async register(userDto: UserEntity): Promise<RegistrationStatus> {
        let status: RegistrationStatus = {
          success: true,
          message: 'user registered',
        };
    
        try {
          await this.userService.addwithDetails(userDto.userName, userDto.firstName, userDto.lastName);
        } catch (err) {
          status = {
            success: false,
            message: err,
          };
        }
    
        return status;
      }
    
      async login(loginUserDto: UserEntity): Promise<LoginStatus> {
        // find user in db
        const user = await this.userService.findByLogin(loginUserDto.userName);
    
        // generate and sign token
        const token = this._createToken(user);
    
        return {
          username: user.userName,
          ...token,
        };
      }
    
      async validateUser(payload: JwtPayload): Promise<UserEntity> {
        const user = await this.userService.findByPayload(payload);
        if (!user) {
          throw 'Invalid token';
        }
        return user;
      }
    
      private _createToken({ userName }: UserEntity): any {
        const expiresIn = '600s';
    
        const user: JwtPayload = { userName };
        const accessToken = this.jwtService.sign(user);
        return {
          expiresIn,
          accessToken,
        };
      }
}


// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { UserService } from '../user/user.service';

// @Injectable()
// export class AuthService {
// 	constructor( private readonly userService: UserService,) {}
//     async findUserFromFourtyTwoId(id: number): Promise<any> {
//     const user = await this.userService.getUser(id);
//     if ( !user ) {
//         throw new UnauthorizedException();
//     }   // not sure if need to compare with intras ID or own DB
//     console.log("findUserFromFourtyTwoId METHOD:")
//     console.log(id);
//     return user;
//     }
// }



// // import {
// // 	Injectable,
// // 	UnauthorizedException,
// // } from '@nestjs/common';
// // import { UsersService } from '../users/users.service';

// // @Injectable()
// // export class AuthService
// // {
// // 	constructor(
// // 		private readonly usersService: UsersService,
// // 	) {
// // 	}

// // 	async findUserFromDiscordId(discordId: string): Promise<any> {
// // 		const user = await this.usersService.findOne('discord_id', discordId);

// // 		if ( !user ) {
// // 			throw new UnauthorizedException();
// // 		}

// // 		return user;
// // 	}
// // }
