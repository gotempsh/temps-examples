import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  home() {
    return { message: 'Hello from NestJS on Temps!' };
  }

  @Get('health')
  health() {
    return { status: 'ok' };
  }
}
