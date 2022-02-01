import { Module } from "@nestjs/common";
import { FriendsService } from "./friends.service";
import { FriendsController } from "./friends.controller";
import { UserModule } from "src/user/user.module";
import { AchievementsModule } from "src/achievements/achievements.module";

@Module({
	imports: [UserModule, AchievementsModule],
	providers: [FriendsService],
	controllers: [FriendsController],
})
export class FriendsModule {}
