import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './../users/users.service';
import { RegisterUserDto } from './dto/registerUser.dto';
import * as bcrypt from 'bcrypt';
import { UserModel } from 'src/users/entities';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  async registerWithEmail(user: RegisterUserDto) {
    const hashRounds =
      this.configService.get<string>('HASH_ROUNDS');

    const hash = bcrypt.hashSync(
      user.password,
      +hashRounds,
    );

    const newUser = await this.usersService.signupUser({
      ...user,
      password: hash,
    });

    return this.loginUser(newUser);
  }

  loginUser(user: Pick<UserModel, 'email' | 'id'>) {
    return {
      accessToken: this.signToken(user, false),
      refreshToken: this.signToken(user, true),
    };
  }

  extractTokenFromHeader(
    header: string,
    isBearer: boolean,
  ) {
    if (!header)
      throw new BadRequestException(
        '토큰이 존재하지 않습니다.',
      );

    const splitToken = header.split(' ');

    const prefix = isBearer ? 'Bearer' : 'Basic';

    if (
      splitToken.length !== 2 ||
      splitToken[0] !== prefix
    ) {
      throw new UnauthorizedException('잘못된 토큰입니다.');
    }

    const token = splitToken[1];

    return token;
  }

  decodeBasicToken(base64String: string) {
    const decoded = Buffer.from(
      base64String,
      'base64',
    ).toString('utf-8');

    const split = decoded.split(':');

    if (split.length !== 2)
      throw new UnauthorizedException(
        '잘못된 유형의 토큰 입니다',
      );

    const email = split[0];
    const password = split[1];

    return {
      email,
      password,
    };
  }

  async authenticateWithEmailAndPassword(
    user: Pick<UserModel, 'email' | 'password'>,
  ) {
    const existingUser =
      await this.usersService.getUserByEmail(user.email);

    if (!existingUser)
      throw new UnauthorizedException(
        '존재하지 않는 사용자 입니다.',
      );

    const comparePassword = bcrypt.compareSync(
      user.password,
      existingUser.password,
    );

    if (!comparePassword)
      throw new UnauthorizedException(
        '비밀번호가 일치하지 않습니다.',
      );

    return existingUser;
  }

  async loginWithEmail(
    user: Pick<UserModel, 'email' | 'password'>,
  ) {
    const existingUser =
      await this.authenticateWithEmailAndPassword(user);

    return this.loginUser(existingUser);
  }

  signToken(
    user: Pick<UserModel, 'email' | 'id'>,
    isRefreshToken: boolean,
  ) {
    const payload = {
      email: user.email,
      id: user.id,
      type: isRefreshToken ? 'refresh' : 'access',
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: isRefreshToken
        ? this.configService.get<string>('JWT_REFRESH_EXP')
        : this.configService.get<string>('JWT_ACCESS_EXP'),
    });
  }

  rotateToken(token: string, isRefreshToken: boolean) {
    const decoded = this.jwtService.verify(token, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });

    if (decoded.type !== 'refresh') {
      throw new UnauthorizedException(
        '토큰 재발급은 refresh 토큰으로만 가능합니다.',
      );
    }

    return this.signToken(
      {
        ...decoded,
      },
      isRefreshToken,
    );
  }

  verifyToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret:
          this.configService.get<string>('JWT_SECRET'),
      });
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException(
        '잘못된 토큰입니다??.',
      );
    }
  }
}
