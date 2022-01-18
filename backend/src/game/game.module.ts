import { Module, forwardRef } from "@nestjs/common";
import { GameService } from "./game.service";
import { GameController } from "./game.controller";
import { GameGateway } from "./game.gateway";
import { MatchModule } from "src/match/match.module";
import { UserModule } from "src/user/user.module";

@Module({
	imports: [forwardRef(() => MatchModule), UserModule],
	providers: [GameService, GameGateway],
	controllers: [GameController],
	exports: [GameService],
})
export class GameModule {}
