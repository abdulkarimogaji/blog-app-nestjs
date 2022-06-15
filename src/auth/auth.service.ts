import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "src/users/schemas/user.schema";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";


@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private configService: ConfigService
  ) {}

  async validateUser(email: string, pwd: string): Promise<any> {
    const user = await this.userModel.findOne({ email });
    // compare hashes
    const match  = await bcrypt.compare(pwd, user.password )
    if (match) {
      return user;
    }
    return null;
  }

  async login(user: any) {
    const payload = { roles: user.roles, sub: user._id };
    // remove password from response
    user.password = undefined
    return {
      access_token: this.jwtService.sign(payload, { secret: this.configService.get('JWT_SECRET')}),
      user,
    };
  }
}
