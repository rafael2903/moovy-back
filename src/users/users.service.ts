import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { email } = createUserDto;
    if (await this.usersRepository.existsBy({ email })) {
      throw new Error(`User with email ${email} already exists.`);
    }
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  findAll() {
    return this.usersRepository.find();
  }

  private findOneBy(where: FindOptionsWhere<User> | FindOptionsWhere<User>[]) {
    return this.usersRepository.findOneBy(where);
  }

  findOneById(id: number) {
    return this.findOneBy({ id });
  }

  findOneByEmail(email: string) {
    return this.findOneBy({ email });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (await this.usersRepository.existsBy({ id })) {
      return await this.usersRepository.update(id, updateUserDto);
    }
    throw new Error(`User with id = ${id} not found.`);
  }

  async remove(id: number) {
    if (await this.usersRepository.existsBy({ id })) {
      return await this.usersRepository.delete(id);
    }
    throw new Error(`User with id = ${id} not found.`);
  }
}
