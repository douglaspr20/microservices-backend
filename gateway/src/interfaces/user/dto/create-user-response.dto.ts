import { IUser } from '../user.interface';

export class CreateUserResponseDto {
  message: string;

  data: {
    user: IUser;
    selfAuthorization?: string;
    authorization?: string;
  };
  errors: { [key: string]: any };
}
