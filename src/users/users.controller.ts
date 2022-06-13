import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { User } from './interfaces/user.interface';
import { UserService } from './users.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(":id")
  getUser(@Param("id") id: string): string {
    return this.userService.getUser(id);
  }

  @Put()
  updateUser(@Body() user: User) {
    return this.userService.updateUser(user)
  }
}
