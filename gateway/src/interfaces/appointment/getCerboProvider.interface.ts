import { ICerboProvider } from './cerboProvider.interface';

export class IGetCerboProviderResponse {
  status: number;
  message: string;
  data?: ICerboProvider;
}
