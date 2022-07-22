import { ForbiddenException, HttpException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "./users/schemas/user.schema";

@Injectable()
export class AppService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  getHello(): string {
    return "Hello World!";
  }

  async googleLogin(req) {
    if (!req.user) {
      return new ForbiddenException();
    }

    try {
      const fetchedUser = await this.userModel.findOne({
        email: req.user.email,
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
        const user: any = req.user;
        user.isOauth = true;
        (user.oauthType = "google"),
          (user.username = user.firstName + " " + user.lastName);
        user.password = req.user.oauthId;

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
      throw new HttpException(error, 500);
    }
  }
}
