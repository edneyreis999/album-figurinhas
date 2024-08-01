import { IUseCase } from '../../../../shared/application/use-case.interface';
import { NotFoundError } from '../../../../shared/domain/errors/not-found.error';
import { Uuid } from '../../../../shared/domain/value-objects/uuid.vo';
import { User } from '../../../domain/user.entity';
import { IUserRepository } from '../../../domain/user.repository';
import { UserOutputMapper, type UserOutput } from '../_user-shared/user-output';

export class UpdateUserUseCase implements IUseCase<UpdateUserInput, UpdateUserOutput> {
  constructor(private userRepo: IUserRepository) {}

  async execute(input: UpdateUserInput): Promise<UpdateUserOutput> {
    const uuid = new Uuid(input.id);
    const user = await this.userRepo.findById(uuid);

    if (!user) {
      throw new NotFoundError(input.id, User);
    }

    if (input.displayName !== undefined) {
      user.changeDisplayName(input.displayName);
    }

    if (input.isActive !== undefined) {
      input.isActive ? user.activate() : user.deactivate();
    }

    await this.userRepo.update(user);

    return UserOutputMapper.toOutput(user);
  }
}

export type UpdateUserInput = {
  id: string;
  displayName?: string;
  isActive?: boolean;
};

export type UpdateUserOutput = UserOutput;
