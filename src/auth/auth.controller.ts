import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import ms from 'ms';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { SignInDto } from './dto/sign-in.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, accessToken } = await this.authService.signIn(
      signInDto.email,
      signInDto.password,
    );

    this.attachAccessTokenCookie(res, accessToken);

    return user;
  }

  @Public()
  @Post('register')
  async signUp(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, accessToken } = await this.authService.signUp(createUserDto);
    this.attachAccessTokenCookie(res, accessToken);
    return user;
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('logout')
  async signOut(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('accessToken');
    return;
  }

  private attachAccessTokenCookie(res: Response, accessToken: string) {
    const expiresDate = new Date(Date.now() + ms('1d'));
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      expires: expiresDate,
    });
  }
}
