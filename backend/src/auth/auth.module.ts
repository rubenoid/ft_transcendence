import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { FourtyTwoStrategy } from './auth.strategy';
import { JwtStrategy } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
    imports: [UserModule,     PassportModule.register({
        defaultStrategy: 'jwt',
        property: 'user',
        session: false,
      }),
      JwtModule.register({
        secret: 'secretkey',
        signOptions: {
          expiresIn: '600s',
        },     }),],
    providers: [AuthService, FourtyTwoStrategy, JwtStrategy],
    controllers: [AuthController, JwtModule]
})
export class AuthModule {}
