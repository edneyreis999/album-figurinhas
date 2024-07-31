import { IUseCase } from '../../../shared/application/use-case.interface';
import { NotFoundError } from '../../../shared/domain/errors/not-found.error';
import { Uuid } from '../../../shared/domain/value-objects/uuid.vo';
import { User } from '../../domain/user.entity';
import { IUserRepository } from '../../domain/user.repository';
import { UserOutputMapper, type UserOutput } from './shared/user-output';

export class AddDustUserUseCase implements IUseCase<AddDustUserInput, AddDustUserOutput> {
  constructor(private userRepo: IUserRepository) {}

  async execute(input: AddDustUserInput): Promise<AddDustUserOutput> {
    const uuid = new Uuid(input.id);
    const user = await this.userRepo.findById(uuid);

    if (!user) {
      throw new NotFoundError(input.id, User);
    }

    console.log('user after', user);
    user.addDust(input.dust);
    console.log('user before', user);

    await this.userRepo.update(user);

    return UserOutputMapper.toOutput(user);
  }
}

export type AddDustUserInput = {
  id: string;
  dust: number;
};

export type AddDustUserOutput = UserOutput;
