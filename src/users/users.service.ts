import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument, UserSchema } from './schemas/user.schema';


@Injectable()
export class UserService {
  
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>, private jwtService: JwtService){}
  
  getUserById(id: string) {
    const user = this.userModel.findById(id)
    return { message: "User fetched successfully", user}
  }


  async createUser(user: CreateUserDto) {
    // make a password hash
    // add to db
    const newUser = await this.userModel.create(user)
    // create access_token
    const payload = { sub: newUser.id, roles: newUser.roles }
    const access_token = this.jwtService.sign(payload, {secret: ""})
    // generate response
    return { message: "User created successfully", user, access_token}
  }
}
