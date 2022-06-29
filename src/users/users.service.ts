import { HttpException, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateUserDto } from "./dto/create-user.dto";
import { User, UserDocument } from "./schemas/user.schema";
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name)
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async getUserById(id: string) {
    const user = await this.userModel.findById(id);
    return { message: "User fetched successfully", user };
  }

  async createUser(user: CreateUserDto) {
    // make a password hash
    user.password = await bcrypt.hash(user.password, 10)
    // add to db
    try {

      const newUser = await this.userModel.create(user);
      // create access_token
      const payload = { sub: newUser._id, roles: newUser.roles };
      // remove password from response
      newUser.password = undefined
      const access_token = this.jwtService.sign(payload, {
        secret: this.configService.get("JWT_SECRET"),
        expiresIn: '5m'
      });
      // generate response
      return { message: "User created successfully", user: newUser, access_token };
    } catch(error) {
      this.logger.error(error)
      if (error.name == "MongoServerError") {
        switch(error.code) {
          case 11000:
            throw new HttpException({
              title: "Identical Records Found",
              detail: "User with this credentials already exists",
            }, 400)
        }
      }
    }
  }
}
