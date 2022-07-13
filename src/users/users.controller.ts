import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";

import { AuthGuard } from "@nestjs/passport";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserService } from "./users.service";

@Controller("users")
export class UserController {
  constructor(
    private userService: UserService
  ) {}

  @Get("me")
  @UseGuards(AuthGuard("jwt"))
  async getUserById(@Req() req) {
    return this.userService.getUserById(req.user.userId);
  }

  @Post()
  createUser(@Body() user: CreateUserDto) {
    return this.userService.createUser(user);
  }
}
