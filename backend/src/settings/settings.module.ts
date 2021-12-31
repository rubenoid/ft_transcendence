import { Module } from "@nestjs/common";
import { SettingsController } from "./settings.controller";
import { SettingsService } from "./settings.service";
import { UserModule } from "src/user/user.module";

@Module({
	imports: [UserModule],
	controllers: [SettingsController],
	providers: [SettingsService],
})
export class SettingsModule {}
