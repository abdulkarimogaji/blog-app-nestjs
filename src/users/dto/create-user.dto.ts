
import { IsString, IsEnum, IsEmail, IsPhoneNumber, IsOptional, IsNotEmpty, IsUrl, IsNumber } from 'class-validator';


export class CreateUserDto {
  @IsString()
   @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsString()
  @IsOptional()
  about: string;

  @IsNotEmpty()
  @IsString()
  username: string


  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsOptional()
  @IsPhoneNumber()
  phone: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsUrl()
  picture: string
  
}