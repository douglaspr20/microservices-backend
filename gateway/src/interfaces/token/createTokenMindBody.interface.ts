export class ICreateTokenResponse {
  status: number;
  message: string;
  token: string | null;
  minbodyToken?: string;
  errors: { [key: string]: any };
}
