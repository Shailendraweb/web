import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { PasswordResetToken } from '../password-reset/entities/password-reset-token.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(PasswordResetToken)
    private readonly passwordResetRepository: Repository<PasswordResetToken>,
  ) {}

  async register(registerDto: RegisterDto) {
    const email = registerDto.email.toLowerCase();
    const existingUser = await this.usersService.findByEmail(email);

    if (existingUser) {
      throw new ConflictException('Email already exists.');
    }

    const user = await this.usersService.createUser({
      ...registerDto,
      email,
    } as any);

    const { passwordHash: _, ...safeUser } = user as any;
    return safeUser;
  }

  async login(loginDto: LoginDto) {
    const email = loginDto.email.toLowerCase();
    const user = await this.usersService.findByEmail(email, true);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const passwordMatches = await bcrypt.compare(
      loginDto.password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const payload = {
      sub: user.id,
      email: user.email,
    };

    const accessToken = this.jwtService.sign(payload);
    const { passwordHash: _, ...safeUser } = user as any;

    return {
      accessToken,
      user: safeUser,
    };
  }

  getProfile(user: any) {
    return user;
  }

  logout() {
    return {
      message: 'Logout successful. Remove the access token on the client.',
    };
  }

  async forgotPassword(body: ForgotPasswordDto) {
    const email = body.email.toLowerCase();
    const user = await this.usersService.findByEmail(email);
    const expiresIn =
      this.configService.get<string>('PASSWORD_RESET_EXPIRES_IN') ?? '15m';
    const expiresAt = new Date(Date.now() + this.parseExpiration(expiresIn));

    if (user) {
      const rawToken = this.generateSecureToken();
      const tokenHash = await bcrypt.hash(rawToken, 12);

      const resetToken = this.passwordResetRepository.create({
        user,
        tokenHash,
        expiresAt,
        usedAt: null,
      });

      await this.passwordResetRepository.save(resetToken);

      // NOTE: send rawToken by email in a later feature.
    }

    return {
      message:
        'If the email exists, password reset instructions have been sent.',
    };
  }

  async resetPassword(body: ResetPasswordDto) {
    const resetToken = await this.passwordResetRepository.findOne({
      where: {},
      relations: ['user'],
    });

    const tokenRecord = await this.passwordResetRepository
      .createQueryBuilder('token')
      .where('token.userId IS NOT NULL')
      .andWhere('token.usedAt IS NULL')
      .andWhere('token.expiresAt > :now', { now: new Date() })
      .getMany();

    const matchingToken = tokenRecord.find((record) =>
      bcrypt.compareSync(body.token, record.tokenHash),
    );

    if (!matchingToken) {
      throw new BadRequestException('Invalid or expired reset token.');
    }

    if (matchingToken.usedAt) {
      throw new BadRequestException('Reset token has already been used.');
    }

    if (matchingToken.expiresAt < new Date()) {
      throw new BadRequestException('Reset token has expired.');
    }

    const passwordHash = await bcrypt.hash(body.password, 12);
    matchingToken.user.passwordHash = passwordHash;
    matchingToken.usedAt = new Date();

    await this.usersService.saveUser(matchingToken.user);
    await this.passwordResetRepository.save(matchingToken);

    return { message: 'Password has been reset successfully.' };
  }

  private generateSecureToken(): string {
    return require('crypto').randomBytes(32).toString('hex');
  }

  private parseExpiration(expiration: string): number {
    if (!expiration) {
      return 15 * 60 * 1000;
    }

    const matches = expiration.match(/^(\d+)(s|m|h|d)$/);
    if (!matches) {
      return Number(expiration) || 15 * 60 * 1000;
    }

    const value = Number(matches[1]);
    const unit = matches[2];

    switch (unit) {
      case 's':
        return value * 1000;
      case 'm':
        return value * 60 * 1000;
      case 'h':
        return value * 60 * 60 * 1000;
      case 'd':
        return value * 24 * 60 * 60 * 1000;
      default:
        return value;
    }
  }
}
