import { Module } from "@nestjs/common";
import { UserModule } from "src/user/user.module";
import { MatchController } from "./match.controller";
import { MatchService } from "./match.service";
import { DatabaseModule } from "src/database/database.module";
import { MatchProvider } from "./match.provider";
import { MatchGateway } from "./match.gateway";
import { GameModule } from "src/game/game.module";

@Module({
	imports: [DatabaseModule, UserModule, GameModule],
	controllers: [MatchController],
	providers: [MatchService, ...MatchProvider, MatchGateway],
	exports: [MatchService, ...MatchProvider],
})
export class MatchModule {}
