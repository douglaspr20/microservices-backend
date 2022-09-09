export class ConfigService {
  private readonly envConfig: { [key: string]: any } = null;

  constructor() {
    this.envConfig = {
      host: process.env.CLASS_SERVICE_HOST,
      port: process.env.CLASS_SERVICE_PORT,
    };
    this.envConfig.gatewayPort = process.env.API_GATEWAY_PORT;
    this.envConfig.mindbodyBaseUrl = process.env.MINDBODY_BASE_URL;
    this.envConfig.minbodyApiKey = process.env.MINDBODY_API_KEY;
    this.envConfig.minbodySiteId = process.env.MINDBODY_SITE_ID;
  }

  get(key: string): any {
    return this.envConfig[key];
  }
}
