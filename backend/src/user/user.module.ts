import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { UserController } from './user.controller';
import { UserProvider } from './user.provider';
import { UserService } from './user.service';


@Module({
	imports: [DatabaseModule],
	controllers: [UserController],
	providers: [UserService, ...UserProvider],
	exports: [UserService, ...UserProvider]
})
export class UserModule {}
