import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from './entities';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
    private readonly configService: ConfigService,
  ) {}
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
      'nickname' | 'password' | 'phone_number'
    >,
    file?: string,
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
    if (file) user.image = file;

    const updatedUserProfile =
      await this.userRepository.save(user);
    return updatedUserProfile;
  }
}
