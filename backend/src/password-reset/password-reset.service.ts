import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PasswordResetToken } from './entities/password-reset-token.entity';

@Injectable()
export class PasswordResetService {
  constructor(
    @InjectRepository(PasswordResetToken)
    private readonly passwordResetRepository: Repository<PasswordResetToken>,
  ) {}

  create(token: PasswordResetToken) {
    return this.passwordResetRepository.save(token);
  }

  findByHash(tokenHash: string) {
    return this.passwordResetRepository.findOne({
      where: { tokenHash },
      relations: ['user'],
    });
  }

  save(token: PasswordResetToken) {
    return this.passwordResetRepository.save(token);
  }
}
