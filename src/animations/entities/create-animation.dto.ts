import { IsNotEmpty, IsString } from 'class-validator';
export class CreateAnimationsDto {
  @IsNotEmpty()
  @IsString()
  fileName: string;

  @IsString()
  @IsNotEmpty()
  projectName: string;

  @IsString()
  @IsNotEmpty()
  jsonData: string;

  constructor(fileName: string, projectName: string, jsonData: string) {
    this.fileName = fileName;
    this.projectName = projectName;
    this.jsonData = jsonData;
  }
}
