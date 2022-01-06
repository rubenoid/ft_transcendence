import { Connection, Repository } from "typeorm";
import { ChatEntity } from "./chat.entity";

export const ChatProvider = [
	{
		provide: "CHAT_REPOSITORY",
		useFactory: (connection: Connection): Repository<ChatEntity> =>
			connection.getRepository(ChatEntity),
		inject: ["DATABASE_CONNECTION"],
	},
];
