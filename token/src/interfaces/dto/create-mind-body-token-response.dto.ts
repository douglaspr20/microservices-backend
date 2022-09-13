export class CreateMindBodyTokenResponseDto {
  status: number;
  message: string;
  minbodyToken?: string;
  errors: { [key: string]: any };
}
