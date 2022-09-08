import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(moduleName?: string | null): string {
    return moduleName ? `Hello from ${moduleName}` : 'Hello World';
  }
}
