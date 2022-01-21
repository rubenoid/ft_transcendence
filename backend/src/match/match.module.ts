import { Module, forwardRef } from "@nestjs/common";
import { UserModule } from "src/user/user.module";
import { MatchController } from "./match.controller";
import { MatchService } from "./match.service";
import { DatabaseModule } from "src/database/database.module";
import { MatchProvider } from "./match.provider";
import { MatchGateway } from "./match.gateway";
import { GameModule } from "src/game/game.module";
import { RatingService } from "src/rating/rating";

@Module({
	imports: [DatabaseModule, UserModule, forwardRef(() => GameModule)],
	controllers: [MatchController],
	providers: [MatchService, ...MatchProvider, MatchGateway, RatingService],
	exports: [MatchService, ...MatchProvider],
})
export class MatchModule {}
