import {
  ForbiddenException,
  HttpException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "src/users/schemas/user.schema";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library";
import { CreateUserDto } from "src/users/dto/create-user.dto";

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
      if (!user) throw new NotFoundException();
      const match = await bcrypt.compare(pwd, user.password);
      if (match) {
        return user;
      }
      return null;
    } catch (err) {
      throw err;
    }
    // compare hashes
  }

  async login(user: any) {
    const payload = { roles: user.roles, sub: user._id };
    // remove password from response
    user.password = undefined;
    const access_token = this.jwtService.sign(payload, {
      secret: this.configService.get("JWT_SECRET"),
    });
    return { message: "Login successful", data: { user, access_token } };
  }

  async googleLogin(cred) {
    try {
      // get user info from credentials
      const client = new OAuth2Client(cred.clientId);
      const userInfo: any = await client.verifyIdToken({
        idToken: cred.credentials,
        audience: cred.clientId,
      });
      const fetchedUser = await this.userModel.findOne({
        email: userInfo.email,
      });
      if (fetchedUser) {
        const payload = { sub: fetchedUser._id, roles: fetchedUser.roles };
        const access_token = this.jwtService.sign(payload, {
          secret: this.configService.get("JWT_SECRET"),
          expiresIn: "2d",
        });
        return {
          message: "login successful",
          data: { user: fetchedUser, access_token },
        };
      } else {
        // create a new user
        const user: any = {
          email: userInfo.email,
          firstName: userInfo.given_name,
          lastName: userInfo.family_name,
          username: userInfo.given_name + " " + userInfo.family_name,
          isOauth: true,
          oauthType: "google",
          password: userInfo.sub,
          picture: userInfo.picture,
        };

        const newUser = await this.userModel.create(user);
        // create access_token
        const payload = { sub: newUser._id, roles: newUser.roles };
        const access_token = this.jwtService.sign(payload, {
          secret: this.configService.get("JWT_SECRET"),
          expiresIn: "2d",
        });
        // remove password from response
        newUser.password = undefined;
        // generate response
        return {
          message: "User created successfully",
          data: { user: newUser, access_token },
        };
      }
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 500);
    }
  }
}
