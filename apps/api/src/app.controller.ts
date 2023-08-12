import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { contract } from '@mono-ex/api-contract';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @TsRestHandler(contract)
  async handler() {
    return tsRestHandler(contract, {
      getPreviousResults: async () => {
        return { status: 200, body: 'world' };
      },
      getStringFromHashsum: async ({ body }) => {
        const result = await this.appService.getStringFromHashsum(body);
        if (!result) {
          return { status: 303, body: '/' };
        }
        return { status: 200, body: result };
      },
    });
  }
}
