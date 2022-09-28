import { IUser } from './user.interface';

export class IUpdateUserResponse {
  status: number;
  message: string;
  user?: IUser;
}
