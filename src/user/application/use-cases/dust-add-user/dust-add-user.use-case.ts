import { IUseCase } from '../../../../shared/application/use-case.interface';
import { NotFoundError } from '../../../../shared/domain/errors/not-found.error';
import { Uuid } from '../../../../shared/domain/value-objects/uuid.vo';
import { User } from '../../../domain/user.entity';
import { IUserRepository } from '../../../domain/user.repository';
import { UserOutputMapper, type UserOutput } from '../_user-shared/user-output';
import type { AddDustUserInput } from './dust-add-user.input';

export class AddDustUserUseCase implements IUseCase<AddDustUserInput, AddDustUserOutput> {
  constructor(private userRepo: IUserRepository) {}

  async execute(input: AddDustUserInput): Promise<AddDustUserOutput> {
    const uuid = new Uuid(input.id);
    const user = await this.userRepo.findById(uuid);

    if (!user) {
      throw new NotFoundError(input.id, User);
    }

    user.addDust(input.dust);

    await this.userRepo.update(user);

    return UserOutputMapper.toOutput(user);
  }
}

export type AddDustUserOutput = UserOutput;
