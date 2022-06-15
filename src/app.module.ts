import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule, ConfigService } from "@nestjs/config";
@Module({
  imports: [
    UserModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true, ignoreEnvVars: false }),
    MongooseModule.forRoot(new ConfigService().get("DB_CONNECTION_URI")),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
