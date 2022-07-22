import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { BlogsModule } from "./blogs/blogs.module";
import { CommentsModule } from "./comments/comments.module";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    UserModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true, ignoreEnvVars: false }),
    MongooseModule.forRoot(new ConfigService().get("DB_CONNECTION_URI")),
    BlogsModule,
    CommentsModule,
    JwtModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
