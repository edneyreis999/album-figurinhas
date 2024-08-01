import { IUseCase } from '../../../../shared/application/use-case.interface';
import { User } from '../../../domain/user.entity';
import { IUserRepository } from '../../../domain/user.repository';
import { UserOutputMapper, type UserOutput } from '../_user-shared/user-output';
import type { CreateUserInput } from './create-user.input';

export class CreateUserUseCase implements IUseCase<CreateUserInput, CreateUserOutput> {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(input: CreateUserInput): Promise<CreateUserOutput> {
    const entity = User.create(input);

    await this.userRepo.insert(entity);

    return UserOutputMapper.toOutput(entity);
  }
}

export type CreateUserOutput = UserOutput;
