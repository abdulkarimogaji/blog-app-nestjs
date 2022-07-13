import { Injectable, NotFoundException } from "@nestjs/common";
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
    try {
      const user = await this.userModel.findOne({ email });
      if (!user) throw new NotFoundException()
      const match  = await bcrypt.compare(pwd, user.password )
    if (match) {
      return user;
    }
    return null;
    }catch(err){
      throw err
    }
    // compare hashes
    
  }

  async login(user: any) {
    const payload = { roles: user.roles, sub: user._id };
    // remove password from response
    user.password = undefined
    const access_token = this.jwtService.sign(payload, { secret: this.configService.get('JWT_SECRET')})
    return { message : "Login successful" , data: { user, access_token}};
  }
}
