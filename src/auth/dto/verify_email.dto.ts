import { IsEmail, IsNotEmpty, ValidationArguments } from 'class-validator';

export class VerfiyEmailDto {
  @IsEmail({}, {
    message: (args: ValidationArguments) => `${args.property}: Please enter a correct email`,
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => `${args.property}: Email is required.`,
  })
  email: string;

  @IsNotEmpty({
    message: (args: ValidationArguments) => `${args.property}: Please make sure you are using the correct URL.`,
  })
  token: string;
}
