export class ConfigService {
  private readonly envConfig: { [key: string]: any } = null;

  constructor() {
    this.envConfig = {
      host: process.env.PATIENT_SERVICE_HOST,
      port: process.env.PATIENT_SERVICE_PORT,
      cerboBaseUrl: process.env.MINDBODY_BASE_URL,
      cerboUsername: process.env.CERBO_USERNAME,
      secretKey: process.env.CERBO_SECRET_KEY,
    };
  }

  get(key: string): any {
    return this.envConfig[key];
  }
}
