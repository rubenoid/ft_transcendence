import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { FourtyTwoStrategy } from './auth.strategy';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [UserModule, 
        PassportModule,
        JwtModule.register({
          secret: 'secretKey',
          signOptions: { expiresIn: '20s' },
        }),
    ],
    providers: [AuthService, FourtyTwoStrategy, JwtStrategy],
    controllers: [AuthController]
})
export class AuthModule {}
