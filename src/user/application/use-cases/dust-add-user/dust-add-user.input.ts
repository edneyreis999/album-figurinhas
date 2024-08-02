import { IsNotEmpty, IsNumber, IsString, Min, validateSync } from 'class-validator';

export type AddDustUserInputConstructorProps = {
  id: string;
  dust: number;
};

export class AddDustUserInput {
  @IsString()
  @IsNotEmpty()
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
    const errors = validateSync(input);
    console.log('errors', errors);
    return errors;
  }
}
