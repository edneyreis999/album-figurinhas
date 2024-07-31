import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';
import { InvalidUuidError, Uuid } from '../../../../../shared/domain/value-objects/uuid.vo';
import { User } from '../../../../domain/user.entity';
import { UserInMemoryRepository } from '../../../../infra/db/in-memory/user-in-memory.repository';
import { GetUserUseCase } from '../../get-user.use-case';

describe('GetUserUseCase Unit Tests', () => {
  let useCase: GetUserUseCase;
  let repository: UserInMemoryRepository;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    useCase = new GetUserUseCase(repository);
  });

  it('should throws error when entity not found', async () => {
    await expect(() => useCase.execute({ id: 'fake id' })).rejects.toThrow(new InvalidUuidError());

    const uuid = new Uuid();
    await expect(() => useCase.execute({ id: uuid.id })).rejects.toThrow(
      new NotFoundError(uuid.id, User),
    );
  });

  it('should returns a user', async () => {
    const items = [User.create({ displayName: 'Movie' })];
    repository.items = items;
    const spyFindById = jest.spyOn(repository, 'findById');
    const output = await useCase.execute({ id: items[0].userId.id });
    expect(spyFindById).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: items[0].userId.id,
      displayName: 'Movie',
      dustBalance: 0,
      isActive: true,
      createdAt: items[0].createdAt,
    });
  });
});
