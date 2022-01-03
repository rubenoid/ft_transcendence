import { Module } from "@nestjs/common";
import { UserModule } from "src/user/user.module";
import { MatchController } from "./match.controller";
import { MatchService } from "./match.service";
import { DatabaseModule } from "src/database/database.module";
import { MatchProvider } from "./match.provider";

@Module({
	imports: [DatabaseModule, UserModule],
	controllers: [MatchController],
	providers: [MatchService, ...MatchProvider],
	exports: [MatchService, ...MatchProvider],
})
export class MatchModule {}
