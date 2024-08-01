import { UserInMemoryRepository } from '../../../infra/db/in-memory/user-in-memory.repository';
import { CreateUserUseCase } from './create-user.use-case';

describe('CreateUserUseCase Unit Tests', () => {
  let useCase: CreateUserUseCase;
  let repository: UserInMemoryRepository;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    useCase = new CreateUserUseCase(repository);
  });

  it('should create a user', async () => {
    const spyInsert = jest.spyOn(repository, 'insert');
    let output = await useCase.execute({ displayName: 'test' });
    expect(spyInsert).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: repository.items[0].userId.id,
      displayName: 'test',
      dustBalance: 0,
      isActive: true,
      createdAt: repository.items[0].createdAt,
    });

    output = await useCase.execute({
      displayName: 'test',
      dustBalance: 230,
      isActive: false,
    });
    expect(spyInsert).toHaveBeenCalledTimes(2);
    expect(output).toStrictEqual({
      id: repository.items[1].userId.id,
      displayName: 'test',
      dustBalance: 230,
      isActive: false,
      createdAt: repository.items[1].createdAt,
    });
  });
});
