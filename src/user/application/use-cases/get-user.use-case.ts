import { IUseCase } from '../../../shared/application/use-case.interface';
import { NotFoundError } from '../../../shared/domain/errors/not-found.error';
import { Uuid } from '../../../shared/domain/value-objects/uuid.vo';
import { User } from '../../domain/user.entity';
import { IUserRepository } from '../../domain/user.repository';
import { UserOutputMapper, type UserOutput } from './shared/user-output';

export class GetUserUseCase implements IUseCase<GetUserInput, GetUserOutput> {
  constructor(private userRepo: IUserRepository) {}

  async execute(input: GetUserInput): Promise<GetUserOutput> {
    const uuid = new Uuid(input.id);
    const user = await this.userRepo.findById(uuid);
    if (!user) {
      throw new NotFoundError(input.id, User);
    }

    return UserOutputMapper.toOutput(user);
  }
}

export type GetUserInput = {
  id: string;
};

export type GetUserOutput = UserOutput;
