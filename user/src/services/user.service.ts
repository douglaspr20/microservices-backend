import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from '../interfaces';
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

    delete newUser.MindBodyToken;
    delete newUser.Password;

    return {
      ...newUser,
    };
  }

  async login(userInfo: LoginUserDto) {
    const { Email, Password } = userInfo;

    const user = await this.userRepository.findOne({
      where: { Email },
    });

    if (!user || !bcrypt.compareSync(Password, user.Password)) {
      return false;
    }

    delete user.MindBodyToken;
    delete user.Password;

    return {
      ...user,
    };
  }

  async searchUserByEmail(Email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        Email,
      },
    });

    return user;
  }

  async searchUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });

    return user;
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const userToUpdate = await this.userRepository.findOneBy({ id });

    if (!userToUpdate) {
      return null;
    }

    const result = await this.userRepository.update(
      { id },
      {
        ...updateUserDto,
      },
    );

    return result.raw;
  }
}
