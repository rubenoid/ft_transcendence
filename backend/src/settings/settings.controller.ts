import { Controller, Post, Param, Get, Put } from "@nestjs/common";
import { SettingsService } from "./settings.service";
import { UserService } from "../user/user.service";

@Controller("settings")
export class SettingsController {
	constructor(private readonly settingsService: SettingsService) {}

	@Put("changeFirstName/:id")
	async changeFirstName(@Param() param) {
		return "";
	}
}
