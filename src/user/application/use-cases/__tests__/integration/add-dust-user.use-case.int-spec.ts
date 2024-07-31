import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';
import { Uuid } from '../../../../../shared/domain/value-objects/uuid.vo';
import { setupSequelize } from '../../../../../shared/infra/testing/helpers';
import { User } from '../../../../domain/user.entity';
import { UserSequelizeRepository } from '../../../../infra/db/sequelize/sequelize/user-sequelize.repository';
import { UserModel } from '../../../../infra/db/sequelize/sequelize/user.model';
import { AddDustUserUseCase } from '../../add-dust-user.use-case';

describe('AddDustUserUseCase Integration Tests', () => {
  let useCase: AddDustUserUseCase;
  let repository: UserSequelizeRepository;

  setupSequelize({ models: [UserModel] });

  beforeEach(() => {
    repository = new UserSequelizeRepository(UserModel);
    useCase = new AddDustUserUseCase(repository);
  });

  it('should throws error when entity not found', async () => {
    const uuid = new Uuid();
    await expect(() => useCase.execute({ id: uuid.id, dust: 500 })).rejects.toThrow(
      new NotFoundError(uuid.id, User),
    );
  });

  it('should add dust to a user', async () => {
    const entity = User.fake().aUser().withDisplayName('test').build();
    repository.insert(entity);

    let output = await useCase.execute({
      id: entity.userId.id,
      dust: 500,
    });
    const updatedDustBalance = entity.dustBalance + 500;
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
          dustBalance: updatedDustBalance + 658,
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
      const entityAddDustd = await repository.findById(new Uuid(i.input.id));
      expect(output).toStrictEqual({
        id: entity.userId.id,
        displayName: i.expected.displayName,
        dustBalance: i.expected.dustBalance,
        isActive: i.expected.isActive,
        createdAt: entityAddDustd!.createdAt,
      });
      expect(entityAddDustd!.toJSON()).toStrictEqual({
        userId: entity.userId.id,
        displayName: i.expected.displayName,
        dustBalance: i.expected.dustBalance,
        isActive: i.expected.isActive,
        createdAt: entityAddDustd!.createdAt,
      });
    }
  });

  it(`should't add dust to a user when dust is negative`, async () => {
    const entity = User.fake().aUser().withDisplayName('test').withDustBalance(500).build();
    repository.insert(entity);
    await expect(() => useCase.execute({ id: entity.userId.id, dust: -200 })).rejects.toThrow(
      new Error('Could not add dust with negative amount'),
    );
  });
});
