import { IsBoolean, IsNotEmpty, IsOptional, IsString, validateSync } from 'class-validator';

export type CreateUserInputConstructorProps = {
  displayName: string;
  dustBalance?: number;
  isActive?: boolean;
};

export class CreateUserInput {
  @IsString()
  @IsNotEmpty()
  displayName!: string;

  @IsString()
  @IsOptional()
  dustBalance?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  constructor(props: CreateUserInputConstructorProps) {
    if (!props) return;
    this.displayName = props.displayName;
    this.dustBalance = props.dustBalance;
    this.isActive = props.isActive;
  }
}

export class ValidateCreateUserInput {
  static validate(input: CreateUserInput) {
    return validateSync(input);
  }
}
