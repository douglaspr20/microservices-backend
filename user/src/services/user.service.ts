import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, LoginUserDto } from '../interfaces/user';
import { User } from '../entities/user.entity';
import { JwtPayload } from '../interfaces/jwtPayload.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}
  async register(createUserDto: CreateUserDto) {
    const { password } = createUserDto;

    const newUser = this.userRepository.create({
      ...createUserDto,
      password: bcrypt.hashSync(password, 12),
    });

    await this.userRepository.save(newUser);

    return {
      ...newUser,
      token: this.getJwtToken({ id: newUser.id }),
    };
  }

  async login(userInfo: LoginUserDto) {
    const { email, password } = userInfo;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { id: true, email: true, password: true },
    });

    if (!bcrypt.compareSync(password, user.password)) {
      return false;
    }

    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  async searchUserByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    return user;
  }

  async searchUserById(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    return user;
  }

  private getJwtToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }
}