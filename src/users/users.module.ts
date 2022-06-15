import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UserController } from './users.controller';
import { UserService } from './users.service';

@Module({
  imports: [MongooseModule.forFeature([{name: User.name, schema: UserSchema}]), JwtModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
