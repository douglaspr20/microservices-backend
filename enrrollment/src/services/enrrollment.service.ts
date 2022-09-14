import { Injectable } from '@nestjs/common';

@Injectable()
export class EnrrollmentService {
  getHello(): string {
    return 'Hello World!';
  }
}
