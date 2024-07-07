import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from './entities';
import { QueryRunner, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  PUBLIC_FOLDER_PATH,
  TEMP_FOLDER_PATH,
  USER_PROFILE_IMAGE_PATH,
} from 'src/common/const/path.const';
import { basename, join } from 'path';
import { promises } from 'fs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
    private readonly configService: ConfigService,
  ) {}
  getRepository(qr?: QueryRunner) {
    return qr
      ? qr.manager.getRepository<UserModel>(UserModel)
      : this.userRepository;
  }

  async createUser(
    user: Pick<
      UserModel,
      'email' | 'nickname' | 'password' | 'phone_number'
    >,
  ) {
    await this.existNickname(user.nickname);

    const emailExists = await this.userRepository.exists({
      where: {
        email: user.email,
      },
    });

    if (emailExists) {
      throw new BadRequestException(
        '이미 가입한 이메일 입니다.',
      );
    }

    const userObject = this.userRepository.create({
      ...user,
    });

    const newUser =
      await this.userRepository.save(userObject);

    return newUser;
  }

  async getUserByEmail(email: string) {
    return this.userRepository.findOne({
      where: {
        email,
      },
    });
  }

  async getUserById(userId: string) {
    return this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
  }

  async existNickname(nickname: string): Promise<boolean> {
    const nicknameExists = await this.userRepository.exists(
      {
        where: {
          nickname,
        },
      },
    );

    if (nicknameExists) {
      throw new BadRequestException(
        '이미 존재하는 닉네임 입니다.',
      );
    }

    return true;
  }

  async existPhoneNumber(
    phone_number: string,
  ): Promise<boolean> {
    const phoneNumberExists =
      await this.userRepository.exists({
        where: {
          phone_number,
        },
      });

    if (phoneNumberExists)
      throw new BadRequestException(
        '이미 등록된 번호 입니다.',
      );

    return true;
  }

  async getAllUsers() {
    return await this.userRepository.find();
  }

  async patchUserById(
    userId: string,
    dto: Pick<
      UserModel,
      'image' | 'nickname' | 'password' | 'phone_number'
    >,
  ) {
    const user = await this.getUserById(userId);

    if (!user) throw new NotFoundException();
    if (dto.nickname) {
      await this.existNickname(dto.nickname);
      user.nickname = dto.nickname;
    }
    if (dto.password) {
      const hashRounds =
        this.configService.get<number>('HASH_ROUNDS');

      const newPassword = bcrypt.hashSync(
        dto.password,
        +hashRounds,
      );

      user.password = newPassword;
    }
    if (dto.phone_number) {
      await this.existPhoneNumber(dto.phone_number);
      user.phone_number = dto.phone_number;
    }
    if (dto.image) user.image = dto.image;

    const updatedUserProfile =
      await this.userRepository.save(user);
    return updatedUserProfile;
  }

  async createUserImage(dto: UpdateUserDto) {
    const tempFilePath = join(TEMP_FOLDER_PATH, dto.image);

    try {
      await promises.access(tempFilePath);
    } catch (error) {
      throw new BadRequestException(
        '파일이 존재하지 않습니다.',
      );
    }

    const fileName = basename(tempFilePath);

    const newPath = join(USER_PROFILE_IMAGE_PATH, fileName);

    await promises.rename(tempFilePath, newPath);

    return true;
  }
}
