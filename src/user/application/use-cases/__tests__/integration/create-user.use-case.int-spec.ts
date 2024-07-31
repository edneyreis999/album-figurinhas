import { Uuid } from '../../../../../shared/domain/value-objects/uuid.vo';
import { setupSequelize } from '../../../../../shared/infra/testing/helpers';
import { UserSequelizeRepository } from '../../../../infra/db/sequelize/sequelize/user-sequelize.repository';
import { UserModel } from '../../../../infra/db/sequelize/sequelize/user.model';
import { CreateUserUseCase } from '../../create-user.use-case';

describe('CreateUserUseCase Integration Tests', () => {
  let useCase: CreateUserUseCase;
  let repository: UserSequelizeRepository;

  setupSequelize({ models: [UserModel] });

  beforeEach(() => {
    repository = new UserSequelizeRepository(UserModel);
    useCase = new CreateUserUseCase(repository);
  });

  it('should create a user', async () => {
    let output = await useCase.execute({ displayName: 'test' });
    let entity = await repository.findById(new Uuid(output.id));
    expect(output).toStrictEqual({
      id: entity!.userId.id,
      displayName: 'test',
      dustBalance: 0,
      isActive: true,
      createdAt: entity!.createdAt,
    });

    output = await useCase.execute({
      displayName: 'test',
      dustBalance: 245,
    });
    entity = await repository.findById(new Uuid(output.id));
    expect(output).toStrictEqual({
      id: entity!.userId.id,
      displayName: 'test',
      dustBalance: 245,
      isActive: true,
      createdAt: entity!.createdAt,
    });

    output = await useCase.execute({
      displayName: 'test',
      dustBalance: 245,
      isActive: true,
    });
    entity = await repository.findById(new Uuid(output.id));
    expect(output).toStrictEqual({
      id: entity!.userId.id,
      displayName: 'test',
      dustBalance: 245,
      isActive: true,
      createdAt: entity!.createdAt,
    });

    output = await useCase.execute({
      displayName: 'test',
      dustBalance: 245,
      isActive: false,
    });
    entity = await repository.findById(new Uuid(output.id));
    expect(output).toStrictEqual({
      id: entity!.userId.id,
      displayName: 'test',
      dustBalance: 245,
      isActive: false,
      createdAt: entity!.createdAt,
    });
  });
});
