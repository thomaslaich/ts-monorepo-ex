import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CollectorModule } from './collector/collector.module';
import { ProducerModule } from './producer/producer.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [CollectorModule, ProducerModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
