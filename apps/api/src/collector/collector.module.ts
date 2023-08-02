import { Module } from '@nestjs/common';
// import { ClientsModule, Transport } from '@nestjs/microservices';
import { CollectorService } from './collector.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CollectorService],
})
export class CollectorModule {}
