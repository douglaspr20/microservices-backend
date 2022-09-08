export class ConfigService {
  private readonly envConfig: { [key: string]: any } = null;

  constructor() {
    this.envConfig = {
      host: process.env.CLIENT_SERVICE_PORT,
      port: process.env.CLIENT_SERVICE_HOST,
    };
    this.envConfig.gatewayPort = process.env.API_GATEWAY_PORT;
    this.envConfig.mindbodyBaseUrl = process.env.MINDBODY_BASE_URL;
  }

  get(key: string): any {
    return this.envConfig[key];
  }
}
