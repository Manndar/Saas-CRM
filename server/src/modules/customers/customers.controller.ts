import { Controller, Get } from '@nestjs/common';

import { CustomersService } from './customers.service';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get('health')
  health() {
    return { message: 'customers module ready' };
  }
}
