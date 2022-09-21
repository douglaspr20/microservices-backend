export class ConfigService {
  private readonly envConfig: { [key: string]: any } = null;

  constructor() {
    this.envConfig = {
      host: process.env.APPOINTMENT_SERVICE_HOST,
      port: process.env.APPOINTMENT_SERVICE_PORT,
      mindbodyBaseUrl: process.env.MINDBODY_BASE_URL,
      mindbodyApiKey: process.env.MINDBODY_API_KEY,
      mindbodySiteId: process.env.MINDBODY_SITE_ID,
      cerboBaseUrl: process.env.CERBO_BASEURL,
      cerboUsername: process.env.CERBO_USERNAME,
      cerboSecretKey: process.env.CERBO_SECRET_KEY,
    };
  }

  get(key: string): any {
    return this.envConfig[key];
  }
}
