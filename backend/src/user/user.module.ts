import { Module, forwardRef } from "@nestjs/common";
import { DatabaseModule } from "src/database/database.module";
import { UserController } from "./user.controller";
import { UserProvider } from "./user.provider";
import { UserService } from "./user.service";
import { UserGateway } from "./user.gateway";
import { ChatModule } from "src/chat/chat.module";
import { ProtectorService } from "../protector/protector";

@Module({
	imports: [DatabaseModule, forwardRef(() => ChatModule)],
	controllers: [UserController],
	providers: [UserService, ...UserProvider, UserGateway, ProtectorService],
	exports: [UserService, ...UserProvider],
})
export class UserModule {}
