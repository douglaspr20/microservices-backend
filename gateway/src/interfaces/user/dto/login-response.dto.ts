import { IUser } from '../user.interface';

export class LoginResponseDto {
  message?: string;
  idToken?: string;
  accessToken?: string;
  expiresIn?: number;
  refreshToken?: string;
  userDb?: IUser;
}
