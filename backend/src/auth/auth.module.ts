import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserModule } from "src/user/user.module";
import { FourtyTwoStrategy } from "./auth.strategy";
import { JwtStrategy } from "./jwt.strategy";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ProtectorService } from "src/protector/protector";
import { RegisteringStrategy } from "./registering.stragey";
@Module({
	imports: [
		UserModule,
		PassportModule,
		JwtModule.register({
			secret: "secretKey",
			signOptions: { expiresIn: "3h" },
		}),
	],
	providers: [AuthService, FourtyTwoStrategy, JwtStrategy, ProtectorService, RegisteringStrategy],
	controllers: [AuthController],
})
export class AuthModule {}
