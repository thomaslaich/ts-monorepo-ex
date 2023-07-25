import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { contract } from '@mono-ex/api-contract';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @TsRestHandler(contract.getStringFromHashsum)
  async getPost() {
    return tsRestHandler(contract.getStringFromHashsum, async ({ body }) => {
      const result = await this.appService.getStringFromHashsum(body);
      if (!result) {
        return { status: 404, body: null };
      }
      return { status: 200, body: result };
    });
  }
}
