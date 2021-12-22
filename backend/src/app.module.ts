import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseController } from './database/database.controller';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { FriendsModule } from './friends/friends.module';
import { SettingsModule } from './settings/settings.module';
// import { BlockedController } from './blocked/blocked.controller';
import { BlockedModule } from './blocked/blocked.module';
// import { AuthController } from './auth/auth.controller';
// import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ UserModule, DatabaseModule, FriendsModule, SettingsModule, BlockedModule, AuthModule],
  // controllers: [AppController, DatabaseController, BlockedController],
  // controllers: [AppController, DatabaseController, AuthController],
  controllers: [AppController, DatabaseController],
  // providers: [AppService, AuthService],
  providers: [AppService],
})
export class AppModule {}
