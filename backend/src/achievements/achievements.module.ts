import { Module } from "@nestjs/common";
import { AchievementsService } from "./achievements.service";
import { AchievementsController } from "./achievements.controller"
import { UserModule } from "src/user/user.module";

@Module({
    imports: [UserModule],
    providers: [AchievementsService],
    controllers: [AchievementsController],
})
export class AchievementsModule {}