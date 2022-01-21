import { Module } from "@nestjs/common";
import { ChatController } from "./chat.controller";
import { ChatEntity, ChatMessageEntity } from "./chat.entity";
import { ChatProvider, ChatMessageProvider } from "./chat.provider";
import { DatabaseModule } from "src/database/database.module";
import { ChatService } from "./chat.service";
import { UserModule } from "src/user/user.module";
import { ChatGateway } from "./chat.gateway";
import { ProtectorService } from '../protector/protector';

@Module({
	imports: [DatabaseModule, UserModule],
	controllers: [ChatController],
	providers: [
		ProtectorService,
		...ChatProvider,
		...ChatMessageProvider,
		ChatEntity,
		ChatMessageEntity,
		ChatService,
		ChatGateway,
	],
})
export class ChatModule {}
