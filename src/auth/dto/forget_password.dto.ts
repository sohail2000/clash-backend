import { IsEmail, IsNotEmpty, ValidationArguments } from 'class-validator';

export class ForgetPasswordDto {
  @IsEmail({}, {
    message: (args: ValidationArguments) => `${args.property}: Please enter a valid email`
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => `${args.property}: Email is required.`
  })
  email: string;
}
