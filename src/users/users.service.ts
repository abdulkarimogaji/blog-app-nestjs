import { Injectable } from '@nestjs/common';
import { User } from "./interfaces/user.interface";


@Injectable()
export class UserService {
  getUser(id: string): string {
    return `This is the details for user with id ${id}`;
  }

  updateUser(u: User) {
    return {message: "User is updated", user: u}
  }
}
