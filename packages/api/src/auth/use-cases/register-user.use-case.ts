import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';

import { BcryptHasher } from '../../common/services/bcrypt-hasher.service';
import { PrismaService } from '../../common/services/prisma.service';
import { RegisterDto } from '../dto';
import { RegisterUserOutput } from '../types';

@Injectable()
export class RegisterUserUseCase {
    constructor(
        private readonly prisma: PrismaService,
        private readonly bcryptHasher: BcryptHasher,
    ) {}

    public async execute(registerDto: RegisterDto): Promise<RegisterUserOutput> {
        const { username, password, roles } = registerDto;

        const existingUser = await this.prisma.user.findUnique({
            where: { username },
        });

        if (existingUser) {
            throw new ConflictException('Пользователь с таким именем уже существует');
        }

        const passwordHash = await this.bcryptHasher.hash(password);

        const existingRoles = await this.prisma.role.findMany({
            where: {
                code: { in: roles },
                deleted: false,
            },
        });

        const foundRoleCodes = existingRoles.map((role) => role.code);
        const missingRoles = roles.filter((roleCode) => !foundRoleCodes.includes(roleCode));

        if (missingRoles.length > 0) {
            const availableRoles = ['admin', 'moderator', 'holder', 'courier', 'user'];

            throw new BadRequestException(
                `Роли не найдены: ${missingRoles.join(', ')}. Роль должна быть одной из: ${availableRoles.join(', ')}`,
            );
        }

        if (existingRoles.length === 0) {
            throw new BadRequestException('Необходимо указать хотя бы одну роль');
        }

        const user = await this.prisma.user.create({
            data: {
                username,
                passwordHash,
                roles: {
                    connect: existingRoles.map((role) => ({ id: role.id })),
                },
            },
            include: {
                roles: true,
            },
        });

        const { passwordHash: _, ...userWithoutPassword } = user;

        return {
            message: 'Пользователь успешно зарегистрирован',
            user: userWithoutPassword,
        };
    }
}
