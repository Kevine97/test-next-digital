import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '../db/entity/account.entity';

@Module({
  providers: [AccountService],
  controllers: [AccountController],
  imports: [TypeOrmModule.forFeature([Account])],
})
export class AccountModule {}
