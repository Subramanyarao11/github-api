import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateIssueDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  title: string;

  @IsNotEmpty()
  @IsString()
  body: string;
}
