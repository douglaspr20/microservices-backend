import { IVisit } from './dto';

export interface IAddClientToClassResponse {
  status: number;
  message: string;
  data: IVisit | null;
  errors: { [key: string]: any };
}
