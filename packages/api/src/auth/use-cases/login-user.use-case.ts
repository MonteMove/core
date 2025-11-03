import { Injectable, UnauthorizedException } from '@nestjs/common';

import { BcryptHasher } from '../../common/services/bcrypt-hasher.service';
import { PrismaService } from '../../common/services/prisma.service';
import { LoginDto } from '../dto';
import { JwtTokenService } from '../jwt.service';
import { LoginUserOutput, SessionInfo } from '../types';

@Injectable()
export class LoginUserUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly bcryptHasher: BcryptHasher,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  public async execute(
    loginDto: LoginDto,
    sessionInfo: SessionInfo,
  ): Promise<LoginUserOutput> {
    const { username, password } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: { username },
      include: { roles: true },
    });

    if (!user) {
      throw new UnauthorizedException('Неверное имя пользователя или пароль');
    }

    if (user.blocked || user.deleted) {
      throw new UnauthorizedException('Аккаунт заблокирован или удален');
    }

    const isPasswordValid = await this.bcryptHasher.compare(
      password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверное имя пользователя или пароль');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    const userPayload = {
      id: user.id,
      username: user.username,
      roles: user.roles.map((role) => role.code),
    };

    const tokens = await this.jwtTokenService.generateTokenPair(
      userPayload,
      sessionInfo,
    );

    const { passwordHash: _, ...userWithoutPassword } = user;

    return {
      tokens,
      user: userWithoutPassword,
    };
  }
}
