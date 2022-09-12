export class ConfigService {
  private readonly envConfig: { [key: string]: any } = null;

  constructor() {
    this.envConfig = {
      host: process.env.USER_SERVICE_HOST,
      port: process.env.USER_SERVICE_PORT,
      gatewayPort: process.env.API_GATEWAY_PORT,
    };
  }

  get(key: string): any {
    return this.envConfig[key];
  }
}
