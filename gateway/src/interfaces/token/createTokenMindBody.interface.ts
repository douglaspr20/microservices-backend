export class ICreateMindBodyToken {
  status: number;
  message: string;
  mindBodyToken?: string;
  errors: { [key: string]: any };
}
