export class ConfigService {
  private readonly envConfig: { [key: string]: any } = null;

  constructor() {
    this.envConfig = {
      host: process.env.PATIENT_SERVICE_HOST,
      port: process.env.PATIENT_SERVICE_PORT,
      cerboBaseUrl: process.env.CERBO_BASEURL,
      cerboUsername: process.env.CERBO_USERNAME,
      cerboSecretKey: process.env.CERBO_SECRET_KEY,
    };
  }

  get(key: string): any {
    return this.envConfig[key];
  }
}
