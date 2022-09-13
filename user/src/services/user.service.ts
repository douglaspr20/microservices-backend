import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, LoginUserDto } from '../interfaces';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async register(createUserDto: CreateUserDto) {
    const { Password } = createUserDto;

    const newUser = this.userRepository.create({
      ...createUserDto,
      Password: bcrypt.hashSync(Password, 12),
    });

    await this.userRepository.save(newUser);

    return {
      ...newUser,
    };
  }

  async login(userInfo: LoginUserDto) {
    const { Email, Password } = userInfo;

    const user = await this.userRepository.findOne({
      where: { Email },
      select: { id: true, Email: true, Password: true },
    });

    if (!bcrypt.compareSync(Password, user.Password)) {
      return false;
    }

    return {
      ...user,
    };
  }

  async searchUserByEmail(Email: string) {
    const user = await this.userRepository.findOne({
      where: {
        Email,
      },
    });

    return user;
  }

  async searchUserById(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    return user;
  }
}
