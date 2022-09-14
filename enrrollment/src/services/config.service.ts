export class ConfigService {
  private readonly envConfig: { [key: string]: any } = null;

  constructor() {
    this.envConfig = {
      host: process.env.ENRROLLMENT_SERVICE_HOST,
      port: process.env.ENRROLLMENT_SERVICE_PORT,
      mindbodyBaseUrl: process.env.MINDBODY_BASE_URL,
      mindbodyApiKey: process.env.MINDBODY_API_KEY,
      mindbodySiteId: process.env.MINDBODY_SITE_ID,
    };
  }

  get(key: string): any {
    return this.envConfig[key];
  }
}
