export class CreateTokenResponseDto {
  status: number;
  message: string;
  token: string | null;
  mindBodyToken?: string;
  errors: { [key: string]: any };
}
