export class ConfigService {
  private readonly envConfig: { [key: string]: any } = null;

  constructor() {
    this.envConfig = {
      host: process.env.USER_SERVICE_HOST,
      port: process.env.USER_SERVICE_PORT,
      dbHost: process.env.DB_HOST,
      dbPort: +process.env.DB_PORT,
      dbUser: process.env.DB_USER,
      dbPassword: process.env.DB_PASSWORD,
      dbName: process.env.DB_NAME,
      nodeEnv: process.env.NODE_ENV,
    };
  }

  get(key: string): any {
    return this.envConfig[key];
  }
}
