import { Connection, Repository } from "typeorm";
import { ChatEntity, ChatMessageEntity } from "./chat.entity";

export const ChatProvider = [
	{
		provide: "CHAT_REPOSITORY",
		useFactory: (connection: Connection): Repository<ChatEntity> =>
			connection.getRepository(ChatEntity),
		inject: ["DATABASE_CONNECTION"],
	},
];

export const ChatMessageProvider = [
	{
		provide: "CHAT_MESSAGE_REPOSITORY",
		useFactory: (connection: Connection): Repository<ChatMessageEntity> =>
			connection.getRepository(ChatMessageEntity),
		inject: ["DATABASE_CONNECTION"],
	},
];
