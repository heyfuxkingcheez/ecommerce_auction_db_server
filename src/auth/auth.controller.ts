import {
  Body,
  Controller,
  Headers,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/registerUser.dto';
import { BasicTokenGuard } from './guard/basic-token.guard';
import { IsPublic } from 'src/common/decorator/is-public.decorator';
import { RefreshTokenGuard } from './guard/bearer-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @IsPublic()
  @UseGuards(BasicTokenGuard)
  postLoginEmail(
    @Headers('authorization') rawToken: string,
  ) {
    const token = this.authService.extractTokenFromHeader(
      rawToken,
      false,
    );

    const credentials =
      this.authService.decodeBasicToken(token);

    return this.authService.loginWithEmail(credentials);
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
