
import { Type } from 'class-transformer';
import { IsBoolean, IsArray, ValidateNested, IsUrl, IsOptional, IsString, IsObject, IsNotEmpty, ArrayMinSize } from 'class-validator';



class BlogSection {

	@IsString({ message: (s) => s.property + " is required" })
	title?: string;

	@IsString({ message: (s) => s.property + " is required" })
	content: string;


	@IsOptional()
	@IsUrl()
	image?: string;

}

export class CreateBlogDto {
	@IsBoolean({ message: (s) => s.property + " is required" })
	isAnonymous: boolean;

	@IsString({ message: (s) => s.property + " is required" })
	title: string;

	@IsArray({ message: (s) => s.property + " is required" })
	tags: string[];

	@IsObject({ message: (s) => s.property + " is required" })
	@ValidateNested()
	@Type(() => BlogSection)
	intro: BlogSection;



	@IsNotEmpty()
	@IsArray({ message: (s) => s.property + " is required" })
	@ValidateNested({ each: true })
	@ArrayMinSize(1)
	@Type(() => BlogSection)
	sections: BlogSection[];


	// not meant to be inputted

	@IsOptional()
	author: string

}