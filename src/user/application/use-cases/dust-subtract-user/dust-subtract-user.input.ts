import { IsNotEmpty, IsNumber, IsString, Min, validateSync } from 'class-validator';

export type SubtractDustUserInputConstructorProps = {
  id: string;
  dust: number;
};

export class SubtractDustUserInput {
  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  dust!: number;

  constructor(props?: SubtractDustUserInputConstructorProps) {
    if (!props) return;
    this.id = props.id;
    this.dust = props.dust;
  }
}

export class ValidateSubtractDustUserInput {
  static validate(input: SubtractDustUserInput) {
    return validateSync(input);
  }
}
