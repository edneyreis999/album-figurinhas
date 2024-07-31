import { IUseCase } from '../../../shared/application/use-case.interface';
import { Uuid } from '../../../shared/domain/value-objects/uuid.vo';
import { IUserRepository } from '../../domain/user.repository';

export class DeleteUserUseCase implements IUseCase<DeleteUserInput, void> {
  constructor(private userRepo: IUserRepository) {}

  async execute(input: DeleteUserInput): Promise<void> {
    const uuid = new Uuid(input.id);
    await this.userRepo.delete(uuid);
  }
}

export type DeleteUserInput = {
  id: string;
};
