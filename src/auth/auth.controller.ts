import { Controller, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController{
  constructor(private authService: AuthService){}

  @Post("login")
  @UseGuards(AuthGuard('local'))
  async login(@Req() req){
    return this.authService.login(req.user)
  }
}