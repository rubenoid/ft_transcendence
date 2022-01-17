import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/database/database.module";
import { UserController } from "./user.controller";
import { UserProvider } from "./user.provider";
import { UserService } from "./user.service";
import { UserGateway } from './user.gateway';

@Module({
	imports: [DatabaseModule],
	controllers: [UserController],
	providers: [UserService, ...UserProvider, UserGateway],
	exports: [UserService, ...UserProvider],
})
export class UserModule {}
