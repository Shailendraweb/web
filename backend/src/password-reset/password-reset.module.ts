import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordResetToken } from './entities/password-reset-token.entity';
import { UserModule } from '../user/user.module';
import { PasswordResetService } from './password-reset.service';

@Module({
  imports: [TypeOrmModule.forFeature([PasswordResetToken]), UserModule],
  providers: [PasswordResetService],
  exports: [PasswordResetService, TypeOrmModule],
})
export class PasswordResetModule {}
