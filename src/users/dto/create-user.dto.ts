
import { IsString, IsEnum, IsEmail, IsPhoneNumber, IsOptional, IsNotEmpty } from 'class-validator';


export class CreateUserDto {
  @IsString()
   @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  displayName: string

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
  
}