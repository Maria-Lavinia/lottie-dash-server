import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateAnimationsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  fileName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  projectName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  jsonData: string;

  constructor(fileName: string, projectName: string, jsonData: string) {
    this.fileName = fileName;
    this.projectName = projectName;
    this.jsonData = jsonData;
  }
}
