import { Module } from '@nestjs/common';
import { CollectorService } from './collector.service';
import { PrismaModule } from '../prisma/prisma.module';
import { CollectorController } from './collector.controller';

@Module({
  imports: [PrismaModule],
  controllers: [CollectorController],
  providers: [CollectorService],
  exports: [CollectorService],
})
export class CollectorModule {}
