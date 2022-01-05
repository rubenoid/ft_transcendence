import { Connection, Repository } from "typeorm";
import { UserEntity } from "./user.entity";

export const UserProvider = [
	{
		provide: "USER_REPOSITORY",
		useFactory: (connection: Connection): Repository<UserEntity> =>
			connection.getRepository(UserEntity),
		inject: ["DATABASE_CONNECTION"],
	},
];
