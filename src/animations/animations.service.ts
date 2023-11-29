// animation.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { AnimationEntity } from './entities/animation.entity';
import { User } from 'src/users/entities/user.entity';
// import { HttpService } from '@nestjs/axios';
import { CreateAnimationsDto } from './entities/create-animation.dto';

@Injectable()
export class AnimationsService {
  constructor(
    @InjectRepository(AnimationEntity)
    private readonly animationRepository: Repository<AnimationEntity>,
    @InjectRepository(User)
    private userRepository: Repository<User>, // private readonly httpService: HttpService,
  ) {}

  async createAnimation(
    createAnimationsDto: CreateAnimationsDto,
    userId: number,
  ) {
    const user = await this.userRepository.findOneBy({ id: userId });

    const animation = new AnimationEntity();
    animation.fileName = createAnimationsDto.fileName;
    animation.projectName = createAnimationsDto.projectName;
    animation.jsonData = createAnimationsDto.jsonData;
    animation.user = user;

    return this.animationRepository.save(animation);
  }

  async findAll() {
    return await this.animationRepository.find();
  }

  async findById(id: number) {
    return await this.animationRepository.findOne({ where: { id } });
  }

  async findByUserId(userId: number) {
    return await this.animationRepository.find({
      where: { user: { id: userId } },
    });
  }
  findAllByUserId(id: number): Promise<AnimationEntity[]> {
    return this.animationRepository.find({ where: { user: { id } } });
  }

  async delete(id: number) {
    return await this.animationRepository.delete(id);
  }

  async filterByProjectName(projectName: string): Promise<AnimationEntity[]> {
    return await this.animationRepository.find({
      where: {
        projectName: ILike(`%${projectName}%`),
      },
    });
  }

  async searchByFileName(fileName: string): Promise<AnimationEntity[]> {
    return await this.animationRepository.find({
      where: {
        fileName: ILike(`%${fileName}%`), //case insensitive
      },
    });
  }
}
