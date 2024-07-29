import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { ClassValidatorFields } from '../../shared/domain/validators/class-validator-fields';
import { User } from './user.entity';

//criar um testes que verifique os decorators
export class UserRules {
  @MaxLength(30, { message: 'Display name must be less than 30 characters' })
  @IsString()
  @IsNotEmpty()
  displayName!: string;

  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 4 })
  @Min(0, { message: 'Dust balance must be greater than 0' })
  @Max(9999, { message: 'Dust balance must be less than 9999' })
  @IsOptional()
  dustBalance!: number | null;

  @IsBoolean()
  @IsNotEmpty()
  isActive!: boolean;

  constructor({ displayName, dustBalance, isActive }: User) {
    Object.assign(this, { displayName, dustBalance, isActive });
  }
}

export class UserValidator extends ClassValidatorFields<UserRules> {
  validate(entity: User) {
    return super.validate(new UserRules(entity));
  }
}

export class UserValidatorFactory {
  static create() {
    return new UserValidator();
  }
}
