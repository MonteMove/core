import { randomUUID } from 'node:crypto';

import { CanActivate, INestApplication, UnauthorizedException, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Request } from 'express';
import { App } from 'supertest/types';

import { BalanceStatus, OperationDirection, RoleCode, WalletKind, WalletType } from '../prisma/generated/prisma';
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth';
import { SortOrder } from '../src/common/enums';
import { PrismaService } from '../src/common/services/prisma.service';
import {
    AdjustmentOperationResponseDto,
    CreateOperationResponseDto,
    GetOperationsResponseDto,
    OperationResponseDto,
    UpdateOperationResponseDto,
} from '../src/operation/dto';
import { OperationSortField } from '../src/operation/dto/requests/get-operations.dto';
import { OperationModule } from '../src/operation/operation.module';
import {
    AdjustmentOperationUseCase,
    CreateOperationUseCase,
    DeleteOperationUseCase,
    GetOperationByIdUseCase,
    GetOperationsUseCase,
    UpdateOperationUseCase,
} from '../src/operation/use-cases';
import { WalletRecalculationService } from '../src/wallet/services/wallet-recalculation.service';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const request = require('supertest') as typeof import('supertest');

let prisma: PrismaService;

beforeAll(async () => {
    prisma = new PrismaService();
    await prisma.$connect();
    await ensureRolesExist(prisma);
});

afterAll(async () => {
    await prisma.$disconnect();
});

describe('Operation use cases integration', () => {
    let walletRecalculationService: WalletRecalculationService;
    let createOperationUseCase: CreateOperationUseCase;
    let updateOperationUseCase: UpdateOperationUseCase;
    let deleteOperationUseCase: DeleteOperationUseCase;
    let adjustmentOperationUseCase: AdjustmentOperationUseCase;
    let getOperationByIdUseCase: GetOperationByIdUseCase;
    let getOperationsUseCase: GetOperationsUseCase;

    beforeAll(() => {
        walletRecalculationService = new WalletRecalculationService(prisma);
        createOperationUseCase = new CreateOperationUseCase(prisma, walletRecalculationService);
        updateOperationUseCase = new UpdateOperationUseCase(prisma, walletRecalculationService);
        deleteOperationUseCase = new DeleteOperationUseCase(prisma, walletRecalculationService);
        adjustmentOperationUseCase = new AdjustmentOperationUseCase(prisma, walletRecalculationService);
        getOperationByIdUseCase = new GetOperationByIdUseCase(prisma);
        getOperationsUseCase = new GetOperationsUseCase(prisma);
    });

    beforeEach(async () => {
        await truncateCoreTables(prisma);
    });

    it('creates operation and recalculates wallet balance', async () => {
        const { user, wallet, operationType } = await seedBaseEntities(prisma);

        await createOperationUseCase.execute(
            {
                typeId: operationType.id,
                description: 'Initial income',
                entries: [
                    {
                        walletId: wallet.id,
                        direction: OperationDirection.credit,
                        amount: 500,
                    },
                ],
            },
            user.id,
        );

        const reloadedWallet = await prisma.wallet.findUniqueOrThrow({ where: { id: wallet.id } });

        expect(reloadedWallet.amount).toBe(500);
        expect(reloadedWallet.balanceStatus).toBe(BalanceStatus.positive);
    });

    it('updates operation entries and keeps wallet balance in sync', async () => {
        const { user, wallet, operationType } = await seedBaseEntities(prisma);

        const created = await createOperationUseCase.execute(
            {
                typeId: operationType.id,
                entries: [
                    {
                        walletId: wallet.id,
                        direction: OperationDirection.credit,
                        amount: 400,
                    },
                ],
            },
            user.id,
        );

        const operationId = created.operation.id;
        const entryId = created.operation.entries[0].id;

        await updateOperationUseCase.execute(
            operationId,
            {
                entries: [
                    {
                        id: entryId,
                        walletId: wallet.id,
                        direction: OperationDirection.credit,
                        amount: 150,
                    },
                    {
                        walletId: wallet.id,
                        direction: OperationDirection.debit,
                        amount: 20,
                    },
                ],
            },
            user.id,
        );

        const reloadedWallet = await prisma.wallet.findUniqueOrThrow({ where: { id: wallet.id } });

        expect(reloadedWallet.amount).toBe(130);
        expect(reloadedWallet.balanceStatus).toBe(BalanceStatus.positive);
    });

    it('deletes operation and rolls back wallet balance', async () => {
        const { user, wallet, operationType } = await seedBaseEntities(prisma);

        const created = await createOperationUseCase.execute(
            {
                typeId: operationType.id,
                entries: [
                    {
                        walletId: wallet.id,
                        direction: OperationDirection.debit,
                        amount: 250,
                    },
                ],
            },
            user.id,
        );

        await deleteOperationUseCase.execute(created.operation.id, user.id);

        const reloadedWallet = await prisma.wallet.findUniqueOrThrow({ where: { id: wallet.id } });

        expect(reloadedWallet.amount).toBe(0);
        expect(reloadedWallet.balanceStatus).toBe(BalanceStatus.neutral);
    });

    it('applies adjustment to reach target amount', async () => {
        const { user, wallet, operationType } = await seedBaseEntities(prisma);

        const result = await adjustmentOperationUseCase.execute(
            {
                walletId: wallet.id,
                targetAmount: 320,
                typeId: operationType.id,
            },
            user.id,
        );

        const reloadedWallet = await prisma.wallet.findUniqueOrThrow({ where: { id: wallet.id } });

        expect(result.adjustmentAmount).toBe(320);
        expect(result.operation).not.toBeNull();
        expect(reloadedWallet.amount).toBe(320);
        expect(reloadedWallet.balanceStatus).toBe(BalanceStatus.positive);
    });

    it('skips adjustment when wallet already at target', async () => {
        const { user, wallet, operationType } = await seedBaseEntities(prisma);

        await createOperationUseCase.execute(
            {
                typeId: operationType.id,
                entries: [
                    {
                        walletId: wallet.id,
                        direction: OperationDirection.credit,
                        amount: 200,
                    },
                ],
            },
            user.id,
        );

        const result = await adjustmentOperationUseCase.execute(
            {
                walletId: wallet.id,
                targetAmount: 200,
                typeId: operationType.id,
            },
            user.id,
        );

        const reloadedWallet = await prisma.wallet.findUniqueOrThrow({ where: { id: wallet.id } });

        expect(result.operation).toBeNull();
        expect(result.adjustmentAmount).toBe(0);
        expect(reloadedWallet.amount).toBe(200);
        expect(reloadedWallet.balanceStatus).toBe(BalanceStatus.positive);
    });

    it('returns operation by id with relations', async () => {
        const { user, wallet, operationType } = await seedBaseEntities(prisma);

        const created = await createOperationUseCase.execute(
            {
                typeId: operationType.id,
                description: 'Salary bonus',
                entries: [
                    {
                        walletId: wallet.id,
                        direction: OperationDirection.credit,
                        amount: 700,
                    },
                ],
            },
            user.id,
        );

        const operation = await getOperationByIdUseCase.execute(created.operation.id);

        expect(operation.id).toBe(created.operation.id);
        expect(operation.entries).toHaveLength(1);
        expect(operation.entries[0]).toMatchObject({
            walletId: wallet.id,
            amount: 700,
            direction: OperationDirection.credit,
        });
        expect(operation.type?.id).toBe(operationType.id);
        expect(operation.created_by?.username).toBe(user.username);
        expect(operation.updated_by?.username).toBe(user.username);
    });

    it('throws when requesting deleted operation by id', async () => {
        const { user, wallet, operationType } = await seedBaseEntities(prisma);

        const created = await createOperationUseCase.execute(
            {
                typeId: operationType.id,
                entries: [
                    {
                        walletId: wallet.id,
                        direction: OperationDirection.credit,
                        amount: 100,
                    },
                ],
            },
            user.id,
        );

        await prisma.operation.update({
            where: { id: created.operation.id },
            data: { deleted: true },
        });

        await expect(getOperationByIdUseCase.execute(created.operation.id)).rejects.toThrow('Операция не найдена');
    });

    it('lists operations with filters and pagination', async () => {
        const base = await seedBaseEntities(prisma);
        const { user, wallet, currency, operationType } = base;

        const secondWallet = await prisma.wallet.create({
            data: {
                userId: user.id,
                updatedById: user.id,
                currencyId: currency.id,
                name: `Wallet ${randomUUID().slice(0, 5)}`,
                amount: 0,
                balanceStatus: BalanceStatus.neutral,
                walletKind: WalletKind.simple,
                walletType: WalletType.inskech,
            },
        });

        const secondType = await prisma.operationType.create({
            data: {
                userId: user.id,
                updatedById: user.id,
                name: `OperationType ${randomUUID().slice(0, 5)}`,
            },
        });

        const first = await createOperationUseCase.execute(
            {
                typeId: operationType.id,
                description: 'Salary inbound',
                conversionGroupId: 10,
                entries: [
                    {
                        walletId: wallet.id,
                        direction: OperationDirection.credit,
                        amount: 500,
                    },
                ],
            },
            user.id,
        );

        await createOperationUseCase.execute(
            {
                typeId: operationType.id,
                description: 'Buy hardware',
                conversionGroupId: 11,
                entries: [
                    {
                        walletId: wallet.id,
                        direction: OperationDirection.debit,
                        amount: 150,
                    },
                ],
            },
            user.id,
        );

        await createOperationUseCase.execute(
            {
                typeId: secondType.id,
                description: 'Secondary wallet income',
                entries: [
                    {
                        walletId: secondWallet.id,
                        direction: OperationDirection.credit,
                        amount: 200,
                    },
                ],
            },
            user.id,
        );

        const all = await getOperationsUseCase.execute({});

        expect(all.operations).toHaveLength(3);
        expect(all.pagination.total).toBe(3);

        const searchFiltered = await getOperationsUseCase.execute({ search: 'salary' });

        expect(searchFiltered.operations).toHaveLength(1);
        expect(searchFiltered.operations[0].id).toBe(first.operation.id);

        const conversionFiltered = await getOperationsUseCase.execute({ conversionGroupId: 10 });

        expect(conversionFiltered.operations).toHaveLength(1);
        expect(conversionFiltered.operations[0].description).toBe('Salary inbound');

        const walletFiltered = await getOperationsUseCase.execute({
            walletId: wallet.id,
            direction: OperationDirection.debit,
        });

        expect(walletFiltered.operations).toHaveLength(1);
        expect(walletFiltered.operations[0].description).toBe('Buy hardware');

        const amountFiltered = await getOperationsUseCase.execute({
            walletId: wallet.id,
            minAmount: 100,
            maxAmount: 160,
        });

        expect(amountFiltered.operations).toHaveLength(1);
        expect(amountFiltered.operations[0].description).toBe('Buy hardware');

        const typeFiltered = await getOperationsUseCase.execute({ typeId: secondType.id });

        expect(typeFiltered.operations).toHaveLength(1);
        expect(typeFiltered.operations[0].description).toBe('Secondary wallet income');

        const paginated = await getOperationsUseCase.execute({
            page: 1,
            limit: 2,
            sortOrder: SortOrder.ASC,
            sortField: OperationSortField.CREATED_AT,
        });

        expect(paginated.operations).toHaveLength(2);
        expect(paginated.pagination).toMatchObject({ total: 3, page: 1, limit: 2, totalPages: 2 });
    });

    it('omits deleted operations from listings', async () => {
        const { user, wallet, operationType } = await seedBaseEntities(prisma);

        const created = await createOperationUseCase.execute(
            {
                typeId: operationType.id,
                entries: [
                    {
                        walletId: wallet.id,
                        direction: OperationDirection.credit,
                        amount: 90,
                    },
                ],
            },
            user.id,
        );

        await deleteOperationUseCase.execute(created.operation.id, user.id);

        const list = await getOperationsUseCase.execute({});

        expect(list.operations).toHaveLength(0);
        expect(list.pagination.total).toBe(0);
    });
});

describe('Operation controller e2e', () => {
    let app: INestApplication<App>;
    let currentUserPayload: TestUserPayload | null = null;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [OperationModule],
        })
            .overrideGuard(JwtAuthGuard)
            .useValue(createAuthGuard(() => currentUserPayload))
            .compile();

        app = moduleRef.createNestApplication();
        app.useGlobalPipes(
            new ValidationPipe({
                transform: true,
                whitelist: true,
                forbidNonWhitelisted: true,
            }),
        );
        await app.init();
    });

    beforeEach(async () => {
        await truncateCoreTables(prisma);
        currentUserPayload = null;
    });

    afterAll(async () => {
        await app.close();
    });

    it('rejects unauthorized requests', async () => {
        await request(app.getHttpServer()).get('/operations').expect(401);
    });

    it('creates operation via controller and recalculates wallet', async () => {
        const base = await seedBaseEntities(prisma);

        currentUserPayload = {
            id: base.user.id,
            username: base.user.username,
            roles: [RoleCode.admin, RoleCode.moderator],
        };

        const server = app.getHttpServer();

        const response = await request(server)
            .post('/operations')
            .send({
                typeId: base.operationType.id,
                description: 'API income',
                entries: [
                    {
                        walletId: base.wallet.id,
                        direction: OperationDirection.credit,
                        amount: 450,
                    },
                ],
            })
            .expect(201);

        expect(response.body).toMatchObject({
            message: 'Операция успешно создана',
            operation: {
                typeId: base.operationType.id,
                entries: [
                    expect.objectContaining({
                        walletId: base.wallet.id,
                        amount: 450,
                    }),
                ],
            },
        });

        const wallet = await prisma.wallet.findUniqueOrThrow({ where: { id: base.wallet.id } });

        expect(wallet.amount).toBe(450);
        expect(wallet.balanceStatus).toBe(BalanceStatus.positive);
    });

    it('updates and retrieves operation through controller flow', async () => {
        const base = await seedBaseEntities(prisma);

        currentUserPayload = {
            id: base.user.id,
            username: base.user.username,
            roles: [RoleCode.admin, RoleCode.moderator],
        };

        const server = app.getHttpServer();

        const createdResponse = await request(server)
            .post('/operations')
            .send({
                typeId: base.operationType.id,
                description: 'Initial purchase',
                entries: [
                    {
                        walletId: base.wallet.id,
                        direction: OperationDirection.debit,
                        amount: 120,
                    },
                ],
            })
            .expect(201);

        const createdBody = createdResponse.body as CreateOperationResponseDto;
        const operationId = createdBody.operation.id;
        const entryId = createdBody.operation.entries[0].id;

        await request(server)
            .put(`/operations/${operationId}`)
            .send({
                entries: [
                    {
                        id: entryId,
                        walletId: base.wallet.id,
                        direction: OperationDirection.debit,
                        amount: 80,
                    },
                    {
                        walletId: base.wallet.id,
                        direction: OperationDirection.credit,
                        amount: 30,
                    },
                ],
            })
            .expect(200)
            .expect(({ body }: { body: UpdateOperationResponseDto }) => {
                expect(body.message).toBe('Операция успешно обновлена');
                expect(body.operation.entries).toHaveLength(2);
            });

        const walletAfterUpdate = await prisma.wallet.findUniqueOrThrow({ where: { id: base.wallet.id } });

        expect(walletAfterUpdate.amount).toBe(-50);
        expect(walletAfterUpdate.balanceStatus).toBe(BalanceStatus.negative);

        const byIdResponse = await request(server).get(`/operations/${operationId}`).expect(200);
        const byIdBody = byIdResponse.body as OperationResponseDto;

        expect(byIdBody.id).toBe(operationId);
        expect(byIdBody.entries).toHaveLength(2);
    });

    it('rejects requests with insufficient role', async () => {
        const base = await seedBaseEntities(prisma);

        currentUserPayload = {
            id: base.user.id,
            username: base.user.username,
            roles: [RoleCode.user],
        };

        await request(app.getHttpServer()).get('/operations').expect(403);
    });

    it('fails validation on invalid operation payload', async () => {
        const base = await seedBaseEntities(prisma);

        currentUserPayload = {
            id: base.user.id,
            username: base.user.username,
            roles: [RoleCode.admin, RoleCode.moderator],
        };

        await request(app.getHttpServer())
            .post('/operations')
            .send({
                typeId: base.operationType.id,
                entries: [],
            })
            .expect(400);
    });

    it('lists and filters operations via controller, handles deletion and adjustment', async () => {
        const base = await seedBaseEntities(prisma);

        currentUserPayload = {
            id: base.user.id,
            username: base.user.username,
            roles: [RoleCode.admin, RoleCode.moderator],
        };

        const server = app.getHttpServer();

        const secondWallet = await prisma.wallet.create({
            data: {
                userId: base.user.id,
                updatedById: base.user.id,
                currencyId: base.currency.id,
                name: `Wallet ${randomUUID().slice(0, 5)}`,
                amount: 0,
                balanceStatus: BalanceStatus.neutral,
                walletKind: WalletKind.simple,
                walletType: WalletType.inskech,
            },
        });

        const secondType = await prisma.operationType.create({
            data: {
                userId: base.user.id,
                updatedById: base.user.id,
                name: `OperationType ${randomUUID().slice(0, 5)}`,
            },
        });

        const salaryResponse = await request(server)
            .post('/operations')
            .send({
                typeId: base.operationType.id,
                description: 'Salary inbound',
                conversionGroupId: 10,
                entries: [
                    {
                        walletId: base.wallet.id,
                        direction: OperationDirection.credit,
                        amount: 500,
                    },
                ],
            })
            .expect(201);
        const salaryBody = salaryResponse.body as CreateOperationResponseDto;

        const hardwareResponse = await request(server)
            .post('/operations')
            .send({
                typeId: base.operationType.id,
                description: 'Buy hardware',
                conversionGroupId: 11,
                entries: [
                    {
                        walletId: base.wallet.id,
                        direction: OperationDirection.debit,
                        amount: 150,
                    },
                ],
            })
            .expect(201);
        const hardwareBody = hardwareResponse.body as CreateOperationResponseDto;

        await request(server)
            .post('/operations')
            .send({
                typeId: secondType.id,
                description: 'Secondary wallet income',
                entries: [
                    {
                        walletId: secondWallet.id,
                        direction: OperationDirection.credit,
                        amount: 200,
                    },
                ],
            })
            .expect(201);

        const listAllResponse = await request(server).get('/operations').expect(200);
        const listAllBody = listAllResponse.body as GetOperationsResponseDto;

        expect(listAllBody.operations).toHaveLength(3);

        const searchResponse = await request(server).get('/operations').query({ search: 'salary' }).expect(200);
        const searchBody = searchResponse.body as GetOperationsResponseDto;

        expect(searchBody.operations).toHaveLength(1);
        expect(searchBody.operations[0].id).toBe(salaryBody.operation.id);

        const conversionResponse = await request(server)
            .get('/operations')
            .query({ conversionGroupId: 10 })
            .expect(200);
        const conversionBody = conversionResponse.body as GetOperationsResponseDto;

        expect(conversionBody.operations).toHaveLength(1);

        const walletFilterResponse = await request(server)
            .get('/operations')
            .query({ walletId: base.wallet.id, direction: OperationDirection.debit })
            .expect(200);
        const walletFilterBody = walletFilterResponse.body as GetOperationsResponseDto;

        expect(walletFilterBody.operations).toHaveLength(1);
        expect(walletFilterBody.operations[0].description).toBe('Buy hardware');

        const amountFilterResponse = await request(server)
            .get('/operations')
            .query({ walletId: base.wallet.id, minAmount: 100, maxAmount: 160 })
            .expect(200);
        const amountFilterBody = amountFilterResponse.body as GetOperationsResponseDto;

        expect(amountFilterBody.operations).toHaveLength(1);
        expect(amountFilterBody.operations[0].description).toBe('Buy hardware');

        const typeFilterResponse = await request(server)
            .get('/operations')
            .query({ typeId: secondType.id })
            .expect(200);
        const typeFilterBody = typeFilterResponse.body as GetOperationsResponseDto;

        expect(typeFilterBody.operations).toHaveLength(1);

        const paginatedResponse = await request(server)
            .get('/operations')
            .query({ page: 1, limit: 2, sortField: OperationSortField.CREATED_AT, sortOrder: SortOrder.ASC })
            .expect(200);
        const paginatedBody = paginatedResponse.body as GetOperationsResponseDto;

        expect(paginatedBody.operations).toHaveLength(2);
        expect(paginatedBody.pagination).toMatchObject({ total: 3, page: 1, limit: 2, totalPages: 2 });

        await request(server).delete(`/operations/${hardwareBody.operation.id}`).expect(200);

        const afterDeleteResponse = await request(server).get('/operations').expect(200);
        const afterDeleteBody = afterDeleteResponse.body as GetOperationsResponseDto;

        expect(afterDeleteBody.operations).toHaveLength(2);

        const adjustmentResponse = await request(server)
            .post('/operations/adjustment')
            .send({
                walletId: base.wallet.id,
                targetAmount: 100,
                typeId: base.operationType.id,
            })
            .expect(201);
        const adjustmentBody = adjustmentResponse.body as AdjustmentOperationResponseDto;

        expect(adjustmentBody.newAmount).toBe(100);
        const walletAfterAdjustment = await prisma.wallet.findUniqueOrThrow({ where: { id: base.wallet.id } });

        expect(walletAfterAdjustment.amount).toBe(100);
    });
});

async function truncateCoreTables(prismaService: PrismaService): Promise<void> {
    await prismaService.$executeRawUnsafe(
        'TRUNCATE TABLE operation_entries, operations, wallets, currencies, operation_types, users RESTART IDENTITY CASCADE',
    );
}

async function seedBaseEntities(prismaService: PrismaService) {
    const user = await prismaService.user.create({
        data: {
            username: `user_${randomUUID()}`,
            passwordHash: 'hash',
        },
    });

    const currency = await prismaService.currency.create({
        data: {
            userId: user.id,
            updatedById: user.id,
            code: `C${randomUUID().slice(0, 5)}`,
            name: `Currency ${randomUUID().slice(0, 5)}`,
        },
    });

    const wallet = await prismaService.wallet.create({
        data: {
            userId: user.id,
            updatedById: user.id,
            currencyId: currency.id,
            name: `Wallet ${randomUUID().slice(0, 5)}`,
            amount: 0,
            balanceStatus: BalanceStatus.neutral,
            walletKind: WalletKind.simple,
            walletType: WalletType.inskech,
        },
    });

    const operationType = await prismaService.operationType.create({
        data: {
            userId: user.id,
            updatedById: user.id,
            name: `OperationType ${randomUUID().slice(0, 5)}`,
        },
    });

    return { user, wallet, currency, operationType };
}

async function ensureRolesExist(prismaService: PrismaService): Promise<void> {
    for (const code of [RoleCode.admin, RoleCode.moderator]) {
        await prismaService.role.upsert({
            where: { code },
            update: {},
            create: {
                code,
                name: code,
            },
        });
    }
}

interface TestUserPayload {
    id: string;
    username: string;
    roles: RoleCode[];
}

function createAuthGuard(getUser: () => TestUserPayload | null): CanActivate {
    return {
        canActivate: (context) => {
            const user = getUser();

            if (!user) {
                throw new UnauthorizedException();
            }

            const req = context.switchToHttp().getRequest<Request & { user?: TestUserPayload }>();

            req.user = user;

            return true;
        },
    } satisfies CanActivate;
}
