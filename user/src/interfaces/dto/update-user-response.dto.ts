import { IUser } from '../user.interface';

export class UpdateUserResponseDto {
  status: number;
  message: string;
  user?: IUser;
}
