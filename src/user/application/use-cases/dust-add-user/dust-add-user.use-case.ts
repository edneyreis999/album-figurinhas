import { IUseCase } from '../../../../shared/application/use-case.interface';
import { NotFoundError } from '../../../../shared/domain/errors/not-found.error';
import { EntityValidationError } from '../../../../shared/domain/validators/validation.error';
import { Uuid } from '../../../../shared/domain/value-objects/uuid.vo';
import { User } from '../../../domain/user.entity';
import { IUserRepository } from '../../../domain/user.repository';
import { UserOutputMapper, type UserOutput } from '../_user-shared/user-output';
import type { AddDustUserInput } from './dust-add-user.input';

export class AddDustUserUseCase implements IUseCase<AddDustUserInput, AddDustUserOutput> {
  constructor(private userRepo: IUserRepository) {}

  async execute(input: AddDustUserInput): Promise<AddDustUserOutput> {
    console.log('AddDustUserUseCase execute', input);
    const uuid = new Uuid(input.id);
    console.log('AddDustUserUseCase execute uuid', uuid);
    const user = await this.userRepo.findById(uuid);
    console.log('user do banco de dados', user);

    if (!user) {
      throw new NotFoundError(input.id, User);
    }

    user.addDust(input.dust);

    console.log('user depois do metodo add', user);

    if (user.notification.hasErrors()) {
      throw new EntityValidationError(user.notification.toJSON());
    }

    console.log('vai retornar user');

    await this.userRepo.update(user);

    return UserOutputMapper.toOutput(user);
  }
}

export type AddDustUserOutput = UserOutput;
