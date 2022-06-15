import { Injectable } from '@nestjs/common';
import { UserService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, @InjectModel(User.name) private userModel: Model<UserDocument>) {}


  async validateUser(email: string, pwd: string): Promise<any> {
    const user = await this.userModel.findOne({email})
    console.log("user: ", user)
    // compare hashes
    if (user.password === pwd) {
      const {password, ...result} = user
      return result
    }
    return null
  }

  async login(user: any){
    const payload = {roles: user.roles, sub: user.id}
    return {access_token: this.jwtService.sign(payload, {secret: ""}), user }
  }
}
