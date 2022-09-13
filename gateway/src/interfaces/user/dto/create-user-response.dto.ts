import { IUser } from '../user.interface';

export class CreateUserResponseDto {
  message: string;

  data: {
    user: IUser;
    mindBodyAuthorization?: string;
    authorization?: string;
  };
  errors: { [key: string]: any };
}
