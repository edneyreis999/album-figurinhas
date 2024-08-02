import type { ValidationError } from 'class-validator';
import { NotFoundError } from '../../../../shared/domain/errors/not-found.error';
import { EntityValidationError } from '../../../../shared/domain/validators/validation.error';
import { Uuid } from '../../../../shared/domain/value-objects/uuid.vo';
import { setupSequelize } from '../../../../shared/infra/testing/helpers';
import { User } from '../../../domain/user.entity';
import { UserSequelizeRepository } from '../../../infra/db/sequelize/sequelize/user-sequelize.repository';
import { UserModel } from '../../../infra/db/sequelize/sequelize/user.model';
import { SubtractDustUserUseCase } from './dust-subtract-user.use-case';

describe('SubtractDustUserUseCase Integration Tests', () => {
  let useCase: SubtractDustUserUseCase;
  let repository: UserSequelizeRepository;

  setupSequelize({ models: [UserModel] });

  beforeEach(() => {
    repository = new UserSequelizeRepository(UserModel);
    useCase = new SubtractDustUserUseCase(repository);
  });

  it('should throws error when entity not found', async () => {
    const uuid = new Uuid();
    await expect(() => useCase.execute({ id: uuid.id, dust: 500 })).rejects.toThrow(
      new NotFoundError(uuid.id, User),
    );
  });

  it('should add dust to a user', async () => {
    const entity = User.fake().aUser().withDisplayName('test').withDustBalance(10000).build();
    repository.insert(entity);

    let output = await useCase.execute({
      id: entity.userId.id,
      dust: 500,
    });
    const updatedDustBalance = entity.dustBalance - 500;
    expect(output).toStrictEqual({
      id: entity.userId.id,
      displayName: entity.displayName,
      dustBalance: updatedDustBalance,
      isActive: true,
      createdAt: entity.createdAt,
    });

    type Arrange = {
      input: {
        id: string;
        dust: number;
      };
      expected: {
        id: string;
        displayName: string;
        dustBalance: number;
        isActive: boolean;
        createdAt: Date;
      };
    };
    const arrange: Arrange[] = [
      {
        input: {
          id: entity.userId.id,
          dust: 0,
        },
        expected: {
          id: entity.userId.id,
          displayName: 'test',
          dustBalance: updatedDustBalance,
          isActive: true,
          createdAt: entity.createdAt,
        },
      },
      {
        input: {
          id: entity.userId.id,
          dust: 658,
        },
        expected: {
          id: entity.userId.id,
          displayName: 'test',
          dustBalance: updatedDustBalance - 658,
          isActive: true,
          createdAt: entity.createdAt,
        },
      },
    ];

    for (const i of arrange) {
      output = await useCase.execute({
        id: i.input.id,
        dust: i.input.dust,
      });
      const entitySubtractDustd = await repository.findById(new Uuid(i.input.id));
      expect(output).toStrictEqual({
        id: entity.userId.id,
        displayName: i.expected.displayName,
        dustBalance: i.expected.dustBalance,
        isActive: i.expected.isActive,
        createdAt: entitySubtractDustd!.createdAt,
      });
      expect(entitySubtractDustd!.toJSON()).toStrictEqual({
        userId: entity.userId.id,
        displayName: i.expected.displayName,
        dustBalance: i.expected.dustBalance,
        isActive: i.expected.isActive,
        createdAt: entitySubtractDustd!.createdAt,
      });
    }
  });

  it(`should't add dust to a user when dustBalance is bigger then 999999`, async () => {
    const entity = User.fake().aUser().withDisplayName('test').withDustBalance(500).build();
    repository.insert(entity);
    await useCase
      .execute({ id: entity.userId.id, dust: 1000000 })
      .catch((error: EntityValidationError) => {
        expect(error).toBeInstanceOf(EntityValidationError);
        expect(error.error).toEqual([{ dustBalance: ['Dust balance must be less than 999999'] }]);
      });
  });

  it(`should't add negavive dust quantity`, async () => {
    const entity = User.fake().aUser().withDisplayName('test').withDustBalance(500).build();
    repository.insert(entity);
    await useCase
      .execute({ id: entity.userId.id, dust: -10 })
      .catch((error: EntityValidationError) => {
        expect(error).toBeInstanceOf(EntityValidationError);
        expect(error.error).toEqual([{ dustBalance: ['Dust balance must be less than 9999999'] }]);
      });
  });

  it(`should throw validation error when dust is less then 0`, async () => {
    const entity = User.fake().aUser().withDisplayName('test').withDustBalance(500).build();
    await repository.insert(entity);
    await useCase
      .execute({ id: entity.userId.id, dust: -10 })
      .catch((errors: ValidationError[]) => {
        expect(errors).toBeInstanceOf(Array);
        expect(errors).toHaveLength(1);
        expect(errors[0].constraints).toEqual({
          min: 'dust must not be less than 0',
        });
      });
  });
});
