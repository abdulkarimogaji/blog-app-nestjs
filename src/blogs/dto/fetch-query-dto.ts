import { Transform } from "class-transformer";
import { IsInt, IsOptional } from "class-validator";

export class FetchQueryDto {
  @IsOptional()
  @IsInt()
  @Transform(({value}) => Number(value))
	page: number;

  @IsOptional()
  @IsInt()
  @Transform(({value}) => Number(value))
  limit: number;

  @IsOptional()
  tag: string;
}