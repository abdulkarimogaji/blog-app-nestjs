
import { Type } from 'class-transformer';
import { IsBoolean, IsMongoId, IsOptional, IsString } from 'class-validator';
import { isObjectIdOrHexString } from 'mongoose';


export class CreateCommentDto {
	@IsBoolean({ message: (s) => s.property + " is required" })
	isAnonymous: boolean;

	@IsString({ message: (s) => s.property + " is required" })
	text: string;

	@IsMongoId({ message: (s) => s.property + " is required" })
    blog: string;

	// not meant to be inputted

	@IsOptional()
	author: string

    

}