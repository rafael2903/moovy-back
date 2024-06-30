import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOneById(+id);

    if (user) return user;
    else {
      throw new HttpException(
        `User with id = ${id} not found.`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto).catch((err) => {
      throw new HttpException(err.message, HttpStatus.NOT_FOUND);
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id).catch((err) => {
      throw new HttpException(err.message, HttpStatus.NOT_FOUND);
    });
  }
}
