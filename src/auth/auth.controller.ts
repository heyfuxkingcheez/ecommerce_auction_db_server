import {
  Body,
  Controller,
  Headers,
  Post,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/registerUser.dto';
import { BasicTokenGuard } from './guard/basic-token.guard';
import { IsPublic } from 'src/common/decorator/is-public.decorator';
import { RefreshTokenGuard } from './guard/bearer-token.guard';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('login')
  @IsPublic()
  @UseGuards(BasicTokenGuard)
  async postLoginEmail(
    @Headers('authorization') rawToken: string,
    @Res() res: Response,
  ) {
    const token = this.authService.extractTokenFromHeader(
      rawToken,
      false,
    );

    const credentials =
      this.authService.decodeBasicToken(token);

    const { accessToken, refreshToken } =
      await this.authService.loginWithEmail(credentials);

    res.cookie('AccessToken', `Bearer ${accessToken}`, {
      maxAge: this.configService.get<number>(
        'JWT_ACCESS_EXP',
      ),
      sameSite: 'none',
      secure: true,
      // domain: '.woogi.shop',
      domain: 'localhost',
      path: '/',
    });

    res.cookie('RefreshToken', `Bearer ${refreshToken}`, {
      maxAge: this.configService.get<number>(
        'JWT_REFRESH_EXP',
      ),
      sameSite: 'none',
      secure: true,
      // domain: '.woogi.shop',
      domain: 'localhost',
      path: '/',
    });
    res.send({
      STATUS_CODES: 200,
      MESSAGE: '로그인 성공',
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
    return;
  }

  @Post('register')
  @IsPublic()
  postRegisterEmail(@Body() dto: RegisterUserDto) {
    return this.authService.registerWithEmail(dto);
  }

  @Post('token/access')
  @IsPublic()
  @UseGuards(RefreshTokenGuard)
  postTokenAccess(
    @Headers('authorization') rawToken: string,
  ) {
    const token = this.authService.extractTokenFromHeader(
      rawToken,
      true,
    );

    const newToken = this.authService.rotateToken(
      token,
      false,
    );

    return {
      accessToken: newToken,
    };
  }

  @Post('token/refresh')
  @IsPublic()
  @UseGuards(RefreshTokenGuard)
  postTokenRefresh(
    @Headers('authorization') rawToken: string,
  ) {
    const token = this.authService.extractTokenFromHeader(
      rawToken,
      true,
    );

    const newToken = this.authService.rotateToken(
      token,
      true,
    );

    return {
      refreshToken: newToken,
    };
  }
}
