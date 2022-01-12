import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DatabaseController } from "./database/database.controller";
import { UserModule } from "./user/user.module";
import { DatabaseModule } from "./database/database.module";
import { FriendsModule } from "./friends/friends.module";
import { SettingsModule } from "./settings/settings.module";
import { BlockedModule } from "./blocked/blocked.module";
import { AuthModule } from "./auth/auth.module";
import { ChatModule } from "./chat/chat.module";
import { MatchModule } from "./match/match.module";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "./auth/jwt.guard";
import { AvatarController } from './avatar/avatar.controller';
import { AvatarService } from './avatar/avatar.service';
import { AvatarModule } from './avatar/avatar.module';

@Module({
	imports: [
		UserModule,
		DatabaseModule,
		FriendsModule,
		SettingsModule,
		BlockedModule,
		AuthModule,
		ChatModule,
		MatchModule,
		AvatarModule,
	],
	controllers: [AppController, DatabaseController, AvatarController],
	providers: [
		{
			provide: APP_GUARD,
			useClass: JwtAuthGuard,
		},
		AppService,
		AvatarService,
	],
})
export class AppModule {}
