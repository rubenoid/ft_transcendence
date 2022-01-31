import { Module } from "@nestjs/common";
import { AchievementsService } from "./achievements.service";
import { AchievementsController } from "./achievements.controller";
import { UserModule } from "src/user/user.module";
import { AchievementsProvider } from "./achievements.provider";
import { DatabaseModule } from "src/database/database.module";

@Module({
	imports: [DatabaseModule, UserModule],
	providers: [AchievementsService, ...AchievementsProvider],
	controllers: [AchievementsController],
	exports: [AchievementsService, ...AchievementsProvider]
})
export class AchievementsModule {}
