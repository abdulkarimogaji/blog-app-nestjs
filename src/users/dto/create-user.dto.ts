
import { IsString, IsEnum, IsEmail, IsPhoneNumber, IsOptional, IsNotEmpty, IsUrl } from 'class-validator';


export class CreateUserDto {
  @IsString()
   @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  username: string

  @IsOptional()
  @IsString()
  @IsEnum({})
  type: string

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
  displayPic: string
  
}