export class CreateMindBodyTokenResponseDto {
  status: number;
  message: string;
  mindBodyToken?: string;
  errors: { [key: string]: any };
}
