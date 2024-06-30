import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  SALT_OR_ROUNDS = 10;

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string) {
    const user = await this.usersService.findOneByEmail(email);

    const isMatch = await bcrypt.compare(password, user?.password || '');

    if (!user || !isMatch) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, email: user.email };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(payload: CreateUserDto) {
    const hash = await bcrypt.hash(payload.password, this.SALT_OR_ROUNDS);

    const data = {
      ...payload,
      password: hash,
    };

    return this.usersService.create(data);
  }
}
