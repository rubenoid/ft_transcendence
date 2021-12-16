import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { FourtyTwoStrategy } from './auth.strategy';

@Module({
    imports: [UserModule],
    providers: [AuthService, FourtyTwoStrategy],
    controllers: [AuthController]
})
export class AuthModule {}
