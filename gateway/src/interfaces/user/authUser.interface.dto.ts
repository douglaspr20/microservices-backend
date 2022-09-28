import { IUser } from './user.interface';

export class ILoginResponse {
  status: number;
  message?: string;
  idToken?: string;
  accessToken?: string;
  expiresIn?: number;
  refreshToken?: string;
  userDb?: IUser;
}
