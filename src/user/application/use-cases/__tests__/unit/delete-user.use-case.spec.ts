import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';
import { InvalidUuidError, Uuid } from '../../../../../shared/domain/value-objects/uuid.vo';
import { User } from '../../../../domain/user.entity';
import { UserInMemoryRepository } from '../../../../infra/db/in-memory/user-in-memory.repository';
import { DeleteUserUseCase } from '../../delete-user.use-case';

describe('DeleteUserUseCase Unit Tests', () => {
  let useCase: DeleteUserUseCase;
  let repository: UserInMemoryRepository;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    useCase = new DeleteUserUseCase(repository);
  });

  it('should throws error when entity not found', async () => {
    await expect(() => useCase.execute({ id: 'fake id' })).rejects.toThrow(new InvalidUuidError());

    const uuid = new Uuid();

    await expect(() => useCase.execute({ id: uuid.id })).rejects.toThrow(
      new NotFoundError(uuid.id, User),
    );
  });

  it('should delete a user', async () => {
    const items = [new User({ displayName: 'test 1' })];
    repository.items = items;
    await useCase.execute({
      id: items[0].userId.id,
    });
    expect(repository.items).toHaveLength(0);
  });
});
