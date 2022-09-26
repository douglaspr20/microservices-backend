import { IUser } from '../user.interface';

export class CreateUserResponseDto {
  message: string;

  data: {
    user: IUser;
    authorization?: string;
  };
  errors: { [key: string]: any };
}
