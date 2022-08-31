import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { GetUser } from './decorators/getUser.decorator';
import { User } from './entities/user.entity';
import { CreateUserDto, LoginUserDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  login(@Body() userInfo: LoginUserDto) {
    return this.authService.login(userInfo);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testingRoute(
    @GetUser() user: User,
    @GetUser(['email', 'firstName']) userCustom: User,
  ) {
    return {
      msg: 'Hello',
      user,
      userCustom,
    };
  }
}
