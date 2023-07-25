import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    {
      provide: AppService,
      useFactory: async () => {
        return AppService.create();
      },
    },
  ],
})
export class AppModule {}
