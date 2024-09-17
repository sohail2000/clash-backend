import { IsEmail, IsNotEmpty, MinLength, ValidationArguments } from 'class-validator';

export class LoginDto {
  @IsEmail({}, {
    message: (args: ValidationArguments) => `${args.property}: Please enter a valid email`
  })
  @IsNotEmpty({ message: (args: ValidationArguments) => `${args.property}: Email is required.` })
  email: string;

  @IsNotEmpty({ message: (args: ValidationArguments) => `${args.property}: Password is required` })
  @MinLength(6, { message: (args: ValidationArguments) => `${args.property}: Password must be 6 characters long` })
  password: string;
}
