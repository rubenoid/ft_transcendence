import { Module } from "@nestjs/common";
import { BlockedService } from "./blocked.service";
import { BlockedController } from "./blocked.controller";
import { UserModule } from "src/user/user.module";
import { FriendsModule } from "src/friends/friends.module";
import { FriendsService } from "src/friends/friends.service"; //??

@Module({
	imports: [UserModule, FriendsModule],
	providers: [BlockedService, FriendsService],
	controllers: [BlockedController],
})
export class BlockedModule {}
