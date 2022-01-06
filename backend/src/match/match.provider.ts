import { Connection, Repository } from "typeorm";
import { MatchEntity } from "./match.entity";

export const MatchProvider = [
	{
		provide: "MATCH_REPOSITORY",
		useFactory: (connection: Connection): Repository<MatchEntity> =>
			connection.getRepository(MatchEntity),
		inject: ["DATABASE_CONNECTION"],
	},
];
