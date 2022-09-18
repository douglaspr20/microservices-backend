import { Transport } from '@nestjs/microservices';

export class ConfigService {
  private readonly envConfig: { [key: string]: any } = null;

  constructor() {
    this.envConfig = {};
    this.envConfig.port = process.env.API_GATEWAY_PORT;
    this.envConfig.secret = process.env.SECRET;
    this.envConfig.userService = {
      options: {
        port: process.env.USER_SERVICE_PORT,
        host: process.env.USER_SERVICE_HOST,
      },
      transport: Transport.TCP,
    };
    this.envConfig.tokenService = {
      options: {
        port: process.env.TOKEN_SERVICE_PORT,
        host: process.env.TOKEN_SERVICE_HOST,
      },
      transport: Transport.TCP,
    };
    this.envConfig.clientService = {
      options: {
        port: process.env.CLIENT_SERVICE_PORT,
        host: process.env.CLIENT_SERVICE_HOST,
      },
      transport: Transport.TCP,
    };
    this.envConfig.classService = {
      options: {
        port: process.env.CLASS_SERVICE_PORT,
        host: process.env.CLASS_SERVICE_HOST,
      },
      transport: Transport.TCP,
    };
    this.envConfig.appointmentService = {
      options: {
        port: process.env.APPOINTMENT_SERVICE_PORT,
        host: process.env.APPOINTMENT_SERVICE_HOST,
      },
      transport: Transport.TCP,
    };

    this.envConfig.saleService = {
      options: {
        port: process.env.SALE_SERVICE_PORT,
        host: process.env.SALE_SERVICE_HOST,
      },
      transport: Transport.TCP,
    };
    this.envConfig.enrrollmentService = {
      options: {
        port: process.env.ENRROLLMENT_SERVICE_PORT,
        host: process.env.ENRROLLMENT_SERVICE_HOST,
      },
      transport: Transport.TCP,
    };
  }

  get(key: string): any {
    return this.envConfig[key];
  }
}
