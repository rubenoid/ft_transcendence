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
import { ChatModule } from './chat/chat.module';
import { MatchController } from './match/match.controller';
import { MatchService } from './match/match.service';
import { MatchModule } from './match/match.module';

@Module({
  imports: [ UserModule, DatabaseModule, FriendsModule, SettingsModule, BlockedModule, AuthModule, ChatModule, MatchModule],
  // controllers: [AppController, DatabaseController, BlockedController],
  // controllers: [AppController, DatabaseController, AuthController],
  controllers: [AppController, DatabaseController, MatchController],
  // providers: [AppService, AuthService],
  providers: [AppService, MatchService],
})
export class AppModule {}
