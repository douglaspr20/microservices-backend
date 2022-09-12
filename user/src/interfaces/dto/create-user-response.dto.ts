import { IUser } from '../user.interface';

export class CreateUserResponseDto {
  message: string;

  data: IUser;
  errors: { [key: string]: any };
}
