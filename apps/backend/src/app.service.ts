import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getStatus() {
    return {
      status: 'ok',
      name: 'Zello API',
      timestamp: new Date().toISOString(),
    };
  }
}
