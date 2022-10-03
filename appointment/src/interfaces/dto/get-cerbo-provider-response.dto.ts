import { ICerboProvider } from '../cerboProvider.interface';

export class GetCerboProviderResponseDto {
  status: number;
  message: string;
  data?: ICerboProvider;
}
