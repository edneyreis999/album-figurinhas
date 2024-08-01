import { IsBoolean, IsNotEmpty, IsOptional, IsString, validateSync } from 'class-validator';

export type CreateUserInputConstructorProps = {
  displayName: string;
  description?: string | null;
  isActive?: boolean;
};

export class CreateUserInput {
  @IsString()
  @IsNotEmpty()
  displayName!: string;

  @IsString()
  @IsOptional()
  description?: string | null;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  constructor(props: CreateUserInputConstructorProps) {
    if (!props) return;
    this.displayName = props.displayName;
    this.description = props.description;
    this.isActive = props.isActive;
  }
}

export class ValidateCreateUserInput {
  static validate(input: CreateUserInput) {
    return validateSync(input);
  }
}
