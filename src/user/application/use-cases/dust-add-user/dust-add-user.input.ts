import { IsNotEmpty, IsNumber, IsUUID, Min, validateSync } from 'class-validator';

export type AddDustUserInputConstructorProps = {
  id: string;
  dust: number;
};

export class AddDustUserInput {
  @IsNotEmpty()
  @IsUUID('all')
  id!: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  dust!: number;

  constructor(props?: AddDustUserInputConstructorProps) {
    if (!props) return;
    this.id = props.id;
    this.dust = props.dust;
  }
}

export class ValidateAddDustUserInput {
  static validate(input: AddDustUserInput) {
    const errors = validateSync(new AddDustUserInput(input));
    return errors;
  }
}
