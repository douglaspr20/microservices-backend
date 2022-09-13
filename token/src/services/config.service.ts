export class ConfigService {
  private readonly envConfig: { [key: string]: any } = null;

  constructor() {
    this.envConfig = {
      host: process.env.TOKEN_SERVICE_HOST,
      port: process.env.TOKEN_SERVICE_PORT,
      mindbodyBaseUrl: process.env.MINDBODY_BASE_URL,
      mindbodyApiKey: process.env.MINDBODY_API_KEY,
      mindbodySiteId: process.env.MINDBODY_SITE_ID,
      mindbodyUser: process.env.MINDBODY_USERNAME,
      mindbodyPassword: process.env.MINDBODY_PASSWORD,
    };
  }

  get(key: string): any {
    return this.envConfig[key];
  }
}
