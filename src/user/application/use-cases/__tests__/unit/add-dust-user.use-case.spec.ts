import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';
import { InvalidUuidError, Uuid } from '../../../../../shared/domain/value-objects/uuid.vo';
import { User } from '../../../../domain/user.entity';
import { UserInMemoryRepository } from '../../../../infra/db/in-memory/user-in-memory.repository';
import { AddDustUserUseCase } from '../../add-dust-user.use-case';

describe('AddDustUserUseCase Unit Tests', () => {
  let useCase: AddDustUserUseCase;
  let repository: UserInMemoryRepository;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    useCase = new AddDustUserUseCase(repository);
  });

  it('should throws error when entity not found', async () => {
    await expect(() => useCase.execute({ id: 'fake id', dust: 500 })).rejects.toThrow(
      new InvalidUuidError(),
    );

    const uuid = new Uuid();

    await expect(() => useCase.execute({ id: uuid.id, dust: 800 })).rejects.toThrow(
      new NotFoundError(uuid.id, User),
    );
  });

  it(`should't add dust to a user when dust is negative`, async () => {
    const entity = User.fake().aUser().withDisplayName('test').withDustBalance(500).build();
    repository.items = [entity];
    await expect(() => useCase.execute({ id: entity.userId.id, dust: -200 })).rejects.toThrow(
      new Error('Could not add dust with negative amount'),
    );
  });

  it('should add dust to a user', async () => {
    const spyAddDust = jest.spyOn(repository, 'update');
    const initialDust = 500;
    let dustBalance = initialDust;
    const entity = User.fake().aUser().withDisplayName('test').withDustBalance(initialDust).build();
    repository.items = [entity];

    let output = await useCase.execute({
      id: entity.userId.id,
      dust: 800,
    });
    expect(spyAddDust).toHaveBeenCalledTimes(1);
    dustBalance += 800;
    expect(output).toStrictEqual({
      id: entity.userId.id,
      displayName: 'test',
      dustBalance: dustBalance,
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
        dustBalance: number | null;
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
          dustBalance: dustBalance,
          isActive: true,
          createdAt: entity.createdAt,
        },
      },
      {
        input: {
          id: entity.userId.id,
          dust: 300,
        },
        expected: {
          id: entity.userId.id,
          displayName: 'test',
          dustBalance: dustBalance + 300,
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
      expect(output).toStrictEqual({
        id: entity.userId.id,
        displayName: entity.displayName,
        dustBalance: i.expected.dustBalance,
        isActive: entity.isActive,
        createdAt: entity.createdAt,
      });
    }
  });
});
