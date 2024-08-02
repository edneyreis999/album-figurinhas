import { NotFoundError } from '../../../../shared/domain/errors/not-found.error';
import { InvalidUuidError, Uuid } from '../../../../shared/domain/value-objects/uuid.vo';
import { User } from '../../../domain/user.entity';
import { UserInMemoryRepository } from '../../../infra/db/in-memory/user-in-memory.repository';
import { UpdateUserUseCase } from './update-user.use-case';

describe('UpdateUserUseCase Unit Tests', () => {
  let useCase: UpdateUserUseCase;
  let repository: UserInMemoryRepository;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    useCase = new UpdateUserUseCase(repository);
  });

  it('should throws error when entity not found', async () => {
    await expect(() => useCase.execute({ id: 'fake id', displayName: 'fake' })).rejects.toThrow(
      new InvalidUuidError(),
    );

    const uuid = new Uuid();

    await expect(() => useCase.execute({ id: uuid.id, displayName: 'fake' })).rejects.toThrow(
      new NotFoundError(uuid.id, User),
    );
  });

  it('should throw an error when aggregate is not valid', async () => {
    const aggregate = new User({ displayName: 'Movie' });
    repository.items = [aggregate];
    await expect(() =>
      useCase.execute({
        id: aggregate.userId.id,
        displayName: 't'.repeat(256),
      }),
    ).rejects.toThrow('Entity Validation Error');
  });

  it('should update a user', async () => {
    const spyUpdate = jest.spyOn(repository, 'update');
    const entity = new User({ displayName: 'Movie' });
    repository.items = [entity];

    let output = await useCase.execute({
      id: entity.userId.id,
      displayName: 'test',
    });
    expect(spyUpdate).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: entity.userId.id,
      displayName: 'test',
      dustBalance: 0,
      isActive: true,
      createdAt: entity.createdAt,
    });

    type Arrange = {
      input: {
        id: string;
        displayName: string;
        dustBalance?: number | null;
        isActive?: boolean;
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
          displayName: 'test',
          dustBalance: 0,
        },
        expected: {
          id: entity.userId.id,
          displayName: 'test',
          dustBalance: 0,
          isActive: true,
          createdAt: entity.createdAt,
        },
      },
      {
        input: {
          id: entity.userId.id,
          displayName: 'test',
        },
        expected: {
          id: entity.userId.id,
          displayName: 'test',
          dustBalance: 0,
          isActive: true,
          createdAt: entity.createdAt,
        },
      },
      {
        input: {
          id: entity.userId.id,
          displayName: 'test',
          isActive: false,
        },
        expected: {
          id: entity.userId.id,
          displayName: 'test',
          dustBalance: 0,
          isActive: false,
          createdAt: entity.createdAt,
        },
      },
      {
        input: {
          id: entity.userId.id,
          displayName: 'test',
        },
        expected: {
          id: entity.userId.id,
          displayName: 'test',
          dustBalance: 0,
          isActive: false,
          createdAt: entity.createdAt,
        },
      },
      {
        input: {
          id: entity.userId.id,
          displayName: 'test',
          isActive: true,
        },
        expected: {
          id: entity.userId.id,
          displayName: 'test',
          dustBalance: 0,
          isActive: true,
          createdAt: entity.createdAt,
        },
      },
      {
        input: {
          id: entity.userId.id,
          displayName: 'test',
          dustBalance: 0,
          isActive: false,
        },
        expected: {
          id: entity.userId.id,
          displayName: 'test',
          dustBalance: 0,
          isActive: false,
          createdAt: entity.createdAt,
        },
      },
    ];

    for (const i of arrange) {
      output = await useCase.execute({
        id: i.input.id,
        ...('name' in i.input && { displayName: i.input.displayName }),
        ...('dustBalance' in i.input && { dustBalance: i.input.dustBalance }),
        ...('isActive' in i.input && { isActive: i.input.isActive }),
      });
      expect(output).toStrictEqual({
        id: entity.userId.id,
        displayName: i.expected.displayName,
        dustBalance: i.expected.dustBalance,
        isActive: i.expected.isActive,
        createdAt: i.expected.createdAt,
      });
    }
  });
});
