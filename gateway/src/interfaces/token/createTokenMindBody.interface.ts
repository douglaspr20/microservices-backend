export class ICreateMindBodyToken {
  status: number;
  message: string;
  minbodyToken?: string;
  errors: { [key: string]: any };
}
