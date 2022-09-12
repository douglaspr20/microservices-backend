import { Injectable } from '@nestjs/common';

@Injectable()
export class ClassService {
  getHello(): string {
    return 'Hello World!';
  }
}
