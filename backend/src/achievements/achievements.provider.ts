import { Connection, Repository } from "typeorm";
import { AchievementsEntity } from "./achievements.entity";

export const AchievementsProvider = [
	{
		provide: "ACHIEVEMENTS_REPOSITORY",
		useFactory: (connection: Connection): Repository<AchievementsEntity> =>
			connection.getRepository(AchievementsEntity),
		inject: ["DATABASE_CONNECTION"],
	},
];
