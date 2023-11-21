// animations.controller.ts
import {
  Controller,
  Post,
  Get,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Req,
  Body,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthGuard } from '@nestjs/passport';
import { AnimationsService } from './animations.service';
import { CreateAnimationsDto } from './entities/create-animation.dto';
import { readFile } from 'fs/promises';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('animations')
@Controller('animations')
export class AnimationsController {
  constructor(private readonly animationsService: AnimationsService) {}

  // @UploadedFile(): This decorator is provided
  //by NestJS to extract the uploaded file from the request.
  // When applied to a parameter, it indicates that the parameter should be populated with information about the uploaded file.
  // file: This is the parameter that will receive the uploaded file. It is of type Express.Multer.File,
  //a type provided by the multer middleware. This type includes information about the uploaded file,
  //such as its original name, size, mimetype, and a path to the temporary storage location.

  @Post('uploadlottie')
  @UseInterceptors(
    FileInterceptor('jsonData', {
      storage: diskStorage({
        destination: './uploads/animations', // specify your upload directory
        filename: (_, file, callback) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return callback(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async create(@UploadedFile() file, @Req() req, @Body() body) {
    try {
      console.log('Received request body:', body);
      const userId = body?.userId;

      // Perform null or undefined checks for other properties
      const fileName = body?.fileName;
      const projectName = body?.projectName;

      console.log('userId:', userId);
      console.log('fileName:', fileName);
      console.log('projectName:', projectName);

      if (userId && fileName && projectName && file) {
        // Create a new AnimationEntity and associate it with the user
        const jsonDataBuffer = await readFile(file.path);
        const jsonData = jsonDataBuffer.toString();

        // Create a new AnimationEntity and associate it with the user
        const createAnimationsDto = new CreateAnimationsDto(
          fileName,
          projectName,
          jsonData,
        );

        console.log('Creating AnimationEntity with DTO:', createAnimationsDto);

        const result = await this.animationsService.createAnimation(
          createAnimationsDto,
          userId,
        );

        console.log('AnimationEntity created successfully:', result);

        return result;
      } else {
        throw new Error('Invalid request body. Missing required properties.');
      }
    } catch (error) {
      console.error('Error uploading animation:', error);
      throw error; // Handle the error as needed
    }
  }

  @Get()
  findAll() {
    return this.animationsService.findAll();
  }

  @Get(':id')
  findById(@Req() req) {
    return this.animationsService.findById(req.params.id);
  }

  @Delete(':id')
  delete(@Req() req) {
    return this.animationsService.delete(req.params.id);
  }

  @Get('userAnimations/:id')
  findAllByUser(@Req() req) {
    return this.animationsService.findAllByUserId(req.params.id);
  }
}
